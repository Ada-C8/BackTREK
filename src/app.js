// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// models and collections
import Trip from './app/models/trip';
// import Reservation from './app/models/reservation';
import TripList from './app/collections/trip_list';


const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'price'];
const RES_FIELDS = ['name', 'email'];

let allTripsTemplate;
let showDetailsTemplate;

// Render Methods

const renderAll = function renderAll(tripList) {
  const tripListElement = $('#trips-list');
  tripListElement.empty();
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }` ).addClass('current-sort-field');

  tripList.on('update', renderAll);
  tripList.on('sort', renderAll);

  tripList.forEach((trip) => {
    let tripsHTML = allTripsTemplate(trip.attributes);
    if (trip.id < 34) {
      tripListElement.append( $(tripsHTML) );
    }
  }); // for each
}; // renderAll function


const renderDetails = function renderDetails(id) {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const oneTrip = new Trip({id: id});
  oneTrip.fetch({}).done(() => {
    tripDetails.append(showDetailsTemplate(oneTrip.attributes));
  });
}; // renderDetails

const makeReservation = function makeReservation(bookTripID, reservationFormData) {
  let reserveURL = 'https://trektravel.herokuapp.com/trips/' + bookTripID + '/reservations';
  console.log(reserveURL);
  $.post(reserveURL, reservationFormData);
  console.log("Posted!");
}

const readAddTripForm = function readAddTripForm() {
  const addTripData = {};
  //select field
  TRIP_FIELDS.forEach( (field) => {
    const inputElement = $(`add-trip-form input[name="${ field }"]`);
    //get field value
    addTripData[field] = inputElement.val();
  });
  return addTripData;
}; // read form function


const clearForm = function clearForm() {
  $('#add-trip-form input[name]').val('');
};


// Document Ready
$(document).ready( () => {


  allTripsTemplate = _.template($('#all-trips-template').html() );
  showDetailsTemplate = _.template($('#show-details-template').html() );

  $('#individual-trip').hide();
  $('#all-trips').hide();
  $('#reserve-trip').hide();
  $('#add-trip').hide();

  const tripList = new TripList();

  tripList.on('sort', renderAll);

  //Events

  // show add trip form

  $('#create-trip').on('click', function() {
    console.log("You clicked to see the add trip form");
    $('#add-trip').show();
  });

  // add a new trip



  $('#add-trip-form').on('submit', (event) => {
    event.preventDefault();

    console.log("You're adding a trip");

    const newTrip = new Trip(readAddTripForm);
    // const addTripFormData = readAddTripForm();
    tripList.add(newTrip);
    newTrip.save();
    // clearForm();
  });

  // make reservations

  $('#reservation-form').on('submit', (event) => {
    event.preventDefault();
    const bookTripID = $(event.target).attr('data-id');
    let reservationFormData =
     $('#reservation-form').serialize();
     console.log(reservationFormData);
    makeReservation(reservationFormData);
  }) //end book trip

  // show trip reservation form
  $('#trip-details').on('click', 'h4', function() {
    console.log("You clicked to see the res form");
    console.log(this);
    const bookTripID = $(this).attr('data-id');
    $('#reservation-form').attr("data-id", bookTripID);
    // add the current trip id to the form
    $('#reserve-trip').show();
  })


  //  show trip details
  $('#trips-list').on('click', '.trips', (event) => {
    const tripID = $(event.target).attr('data-id');
    $('#individual-trip').show();
    renderDetails(tripID);
    window.scrollTo(0, 0);
  });

  // show all the trips

  const allTrips = $('#load-trips');
  allTrips.on('click', () => {
    tripList.fetch();
    $('#all-trips').show();
  })

  // Sort Fields
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);

    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      tripList.comparator = field;
      tripList.sort();

    }); // click event handler
  }); // fields for each







}); // end document ready



const sampleHandler = (event) => {
  console.log("this is just a test");
  console.log(event);
}



// https://ada-backtrek-api.herokuapp.com/trips/1/reservations
// let reserveTrip = function reserveTrip(id, formData) {
//   reserveURL = (baseURL+'/'+ id + '/reservations');
//   console.log(reserveURL);
//   $.post(reserveURL, formData, (response) => {
//     $('#makeReservation').html('<p> Reservation added! </p>');
//     console.log(response);
//     alert("Your Trip is Reserved!");
//     $('#book-trip-form').hide();
//     $('.trip-details').children().hide();
//   })
//   .fail(function(response){
//     $('#fail').html('<p>Request was unsuccessful</p>')
//   })
//   .always(function(){
//     console.log('always even if we have success or failure');
//   });
// };

// const makeReservation = function makeReservation() {
//   const resData = {};
//   RES_FIELDS.forEach((field) => {
//     const inputElement = $(`#reservation-form input[name="{ field }"]`);
//     resData[field] = inputElement.val();
//   });
//
//   return resData;
//
// };
