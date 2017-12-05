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
let statusMessageTemplate;

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

// error messages

const reportStatus = function(status, message) {
  console.log(`Reporting ${ status } message: ${ message } `);
  const generatedHTML = statusMessageTemplate({
    status: status,
    message: message,
  });

  $('#status-messsages ul').append(generatedHTML);
  $('status-messages').show()
}

const tripsApiErrorHandler = function(model, response) {
  model.destroy();

  if (response.responseJSON['errors']) {
    const errors = response.responseJSON['errors'];
    for (const field in errors) {
      for (const problem of errors[field]) {
        reportStatus('error', ` ${ field }: ${ problem }`);
      } // for problem
    } // error

  } else {
   reportStatus('error', 'Could not save trip');
   console.log('Error response from server:')
   console.log(response);
 } // end else
} //handler

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
  $.post(reserveURL, reservationFormData);
}

const readAddTripForm = function readAddTripForm() {
  const addTripData = {};
  TRIP_FIELDS.forEach( (field) => {
    const inputElement = $(`add-trip-form input[name="${ field }"]`);
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
  statusMessageTemplate = _.template($('#status-message-template').html() );

  $('#individual-trip').hide();
  $('#all-trips').hide();
  $('#reserve-trip').hide();
  $('#add-trip').hide();
  $('#status-messages').hide();

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

    $('#individual-trip').hide();
    const newTrip = new Trip(readAddTripForm);
    tripList.add(newTrip);
    newTrip.save({}, {
      success: clearForm,
      error: tripsApiErrorHandler
    });
    $('#status-messages').show
  });

  // make reservations

  $('#reservation-form').on('submit', (event) => {
    event.preventDefault();
    const bookTripID = $(event.target).attr('data-id');
    let reservationFormData =
     $('#reservation-form').serialize();
    makeReservation(reservationFormData);
  }) //end book trip

  // show trip reservation form
  $('#trip-details').on('click', 'h4', function() {
    console.log("You clicked to see the res form");
    console.log(this);
    const bookTripID = $(this).attr('data-id');
    $('#reservation-form').attr("data-id", bookTripID);
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

  // Clear error messages
  $('#status-messages button.clear').on('click', (event) => {
    $('#status-messages ul').html('');
    $('#status-messages').hide
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
