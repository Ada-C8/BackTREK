// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//MODELS & COLLECTIONS IMPORT
import TripsList from './app/collections/trips_list.js';
import Trip from './app/models/trip.js';
import Reservation from './app/models/reservation.js';

////////////VARIABLE DECLARATIONS AND FUNCTIONS ///////////////
const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

const RES_FIELDS = ['name', 'age', 'email'];

let tripsTemplate;
let tripTemplate;
let statusMessageTemplate;

const tripsList = new TripsList();

////////////////////REPORT ERROR STATUS ////////////////////
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } message: ${ message}`);
  const generatedHTML = statusMessageTemplate({
    status: status,
    message: message,
  });

  $('#status-messages ul').append(generatedHTML);
  $('#status-messages').show();
};

const filterTrips = function filterTrips(trips) {
  let filter = $('#filter-value').val().toLowerCase().trim();
  let filterType = $('#filter-type').val();

  // alert(filterType); // way to test that the input is what we think it will be
  if (filter === "") {
    return trips;
  }

  // want to pass in collection.models -- want to pass in an array of models
  let results = _.filter(tripsList.models, function(trip) {
    if (filterType === 'name' || filterType === 'category' || filterType === 'continent') {
      if (trip.get(filterType).toLowerCase().includes(filter)) {      // string filter
        return true;
      }
    } else {
      if (trip.get(filterType) <= parseInt(filter)) {   // integer filter
        return true;
      }
    }

    return false;
  });

  return results;
}

/////////////////RENDER ALL TRIPS //////////////////
const renderTrips = function renderTrips(list) {
  let trips = filterTrips(list);

  $('#trips-table').show();
  const tripTableElement = $('#trips-list');
  tripTableElement.html('');

  trips.forEach((trip) => {
    const generatedHTML = tripsTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  $('.see-trips-button').hide();
};

//////////// RENDER INDIVIDUAL TRIPS /////////////////
const renderTrip = function renderTrip(trip) {
  const tripElement = $('#trip-detail');

  const generatedHTML = $(tripTemplate(trip.attributes));
  generatedHTML.on('click', '.button', addReservationHandler);
  tripElement.html(generatedHTML);
};

////////////// ADD TRIP HANDLER //////////////////////
const addTripHandler = function(event) {
  event.preventDefault();

  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want

    if (field === "continent") {
      const selectElement = $(`#add-trip-form option[name="${ field }"]`);
      let selectValue = selectElement.val();

      tripData[field] = selectValue;
      selectElement.val('');

    } else {
      const inputElement = $(`#add-trip-form input[name="${ field }"]`);
      let value = inputElement.val();

      const numArray = ["weeks", "cost"];

      if (numArray.includes(field)){
        value = Number(value);
      }

      tripData[field] = value;
      inputElement.val('');
    }
  });

  const trip = new Trip(tripData);

  if (!trip.isValid()) {
    handleValidationErrors(trip.validationError);
    return;
  }

  trip.save({}, {
    success: (model, response) => {
      tripsList.add(model);
      reportStatus('success', 'Successfully add a trip!');
    },
    error: (model, response) => {
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error',`${field}: ${problem}`);
        }
      }
    },
  });
};


//////////////// HANDLE VALIDATION ERRORS ///////////

const handleValidationErrors = function handleValidationErrors(errors){
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

//////////////// ADD RESERVATION HANDLER ////////////////
const addReservationHandler = function(event) {
  event.preventDefault();

  const reservationData = {
    trip_id: $(this).data('id'),
  };

  RES_FIELDS.forEach((field) => {
    const inputElement = $(`#makeReservation input[name=" ${ field } "]`);
    const value = inputElement.val();

    reservationData[field] = value;

    inputElement.val('');
  });

  const reservation = new Reservation (reservationData);

  if (!reservation.isValid()) {
    handleValidationErrors(reservation.validationError);
    return;
  }

  reservation.save({}, {
    success: (model, response) => {
      reportStatus('success', 'Successfully made a reservation!');
    },
    error: (model, response) => {
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error',`${field}: ${problem}`);
        }
      }
    },
  })
};

//// DOCUMENT READY ////////

$(document).ready(() => {

  $('#trips-table').hide();
  $('#add-trip-form').hide();
  //underscore
  tripsTemplate = _.template($('#trips-list-template').html());
  tripTemplate = _.template($('#trip-template').html());
  statusMessageTemplate = _.template($('#status-message-template').html());

  //backbone
  tripsList.fetch();

  // jquery
  $('#trips-list').on('click', '.trips', function(event) {
    const trip = new Trip({ id: $(this).data("id")});

    trip.on('change', renderTrip);
    trip.fetch();
  });

  $('.see-trips-button').on('click', function() {
    tripsList.on('update', renderTrips);
    tripsList.on('sort', renderTrips); // register an event handler

    tripsList.fetch();

    // sorting handling
    TRIP_FIELDS.forEach((field) => {
      const headerElement = $(`th.sort.${field}`);
      headerElement.on('click', (event) => {
        tripsList.comparator = field;
        tripsList.sort();
        $('th.sort').removeClass('.current-sort-field');
        $(`th.sort.${tripsList.compator}`).addClass('.current-sort-field');
      });
    });
  });

  ///////////// FILTERING /////////////////

  // prevent form from refreshing the DOM
  $('#filter-form').on('submit', function(event) {
    event.preventDefault();
  });

  $('#filter-value').on('keyup', function(event) {
    renderTrips(tripsList.models);
  });

  // clear input when select another filter type

  $('#filter-type').on('change', function(event) {
    $('#filter-value').val('');
    renderTrips(tripsList.models);
  });

  // add trip
  $('#add-trip-form').on('submit', addTripHandler);

  $('#add-trip-button-show').click(function() {
    $('#add-trip-form').toggle();
  })


  $('#status-messages button.clear').on('click', function(event) {
    $('#status-messages ul').html('');
    $('#status-messages').hide();
  })
});


////

// GAME PLAN
// user needs to be given some sort of visual feedback that the data has been sorted
  /// tried to add it but having some issues displaying -- need to work on it
/// WAVE 3 ///////// optional
// filtering --- the challenging piece of the project
// 1. figure out the modal situation
// work on continent error handling issues
// check to see if when I add a trip, it is sorted


// done
// Wednesday
// 5. create a button to see a list of trips
// 2. flesh out the details section of html
// 3. figure out how to make the reservation - is it a separate model, how to take in the id to post to the write place
// 6. ask about the API error handling -- i did not have a problem adding a new trip -- no backlash for empty fields (wrong api address)


//Thursday
// 4. work on error handling

// Friday
// 7. check out client side validation work on the code
// sorting by...
// Name
// Continent
// Weeks
// Category
// Cost
