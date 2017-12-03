// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

// models and collections
import Trip from './app/models/trip';
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
    tripListElement.append( $(tripsHTML) );
  }); // for each
}; // renderAll function

const sampleHandler = (event) => {
  console.log("this is just a test");
  console.log(event);
}


const renderDetails = function renderDetails(id) {
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  const oneTrip = new Trip({id: id});
  oneTrip.fetch({}).done(() => {
    tripDetails.append(showDetailsTemplate(oneTrip.attributes));
  });
}; // renderDetails


const makeReservation = function makeReservation() {
const resData = {};
RES_FIELDS.forEach((field) => {
  const inputElement = $(`#reservation-form input[name="{ field }"]`);
  resData[field] = inputElement.val();
});

return resData;

};

const clearForm = function clearForm() {
  $('#reservation-form input[name]').val('');
}


// Document Ready
$(document).ready( () => {


  allTripsTemplate = _.template($('#all-trips-template').html() );
  showDetailsTemplate = _.template($('#show-details-template').html() );



  $('#individual-trip').hide();
  $('#all-trips').hide();
  $('#reserve-trip').hide();

  const tripList = new TripList();

  tripList.on('sort', renderAll);

  //Events

  // // make reservations
  // $('.trip-details').on('click', 'h4', function() {
  //   let tripID = $(this).attr('data-id');
  //   $('#book-trip-form').attr("data-id", tripID);
  //   $('#book-trip-form').show();
  // })
  //
  // $('#book-trip-form').on('submit', function(event) {
  //   event.preventDefault();
  //   let tripID = $(this).attr('data-id');
  //   let formData = $('#book-trip-form').serialize();
  //   reserveTrip(tripID, formData);
  // }) //end book trip

  // book trip
$('#trip-details').on('click', 'h4', function() {
  console.log("You clicked to see the res form");
  console.log("this");
  const bookTripID = $(this).attr('data-id');
  $('#reservation-form').attr("data-id", bookTripID);
  $('#reservation-form').show();
})

  //  show trip details
  $('#trips-list').on('click', '.trips', (event) => {
    const tripID = $(event.target).attr('data-id');
    $('#individual-trip').show();
    renderDetails(tripID);
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
