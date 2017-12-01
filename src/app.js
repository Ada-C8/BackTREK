// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

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

/////////////////RENDER ALL TRIPS //////////////////
const renderTrips = function renderTrips(list) {
  const tripTableElement = $('#trips-list');
  tripTableElement.html('');

  list.forEach((trip) => {
    const generatedHTML = tripsTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  })
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

  console.log('in the add trip handler');
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

  trip.save({}, {
    success: (model, response) => {
      tripsList.add(model);
      console.log("Success!")
      reportStatus('success', 'Successfully add a trip!');
    },
    error: (model, response) => {
      console.log('Failed to save a trip! Server response:');
      console.log(response);

      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error',`${field}: ${problem}`);
        }
      }
    },
  });
};

//////////////// ADD RESERVATION HANDLER ////////////////
const addReservationHandler = function(event) {
  event.preventDefault();
  console.log('in the reservation handler');

  const reservationData = {
    trip_id: $(this).data('id'),
  };

  RES_FIELDS.forEach((field) => {
    const inputElement = $(`#makeReservation input[name=" ${ field } "]`);
    let value = inputElement.val();

    reservationData[field] = value;

    inputElement.val('');
    console.log('reading reservation data');
    console.log(reservationData);
  });
  const reservation = new Reservation (reservationData);

  console.log(reservation);
  console.log(`the reservation data is ${reservationData}`);

  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully added a reservation')
      reportStatus('success', 'Successfully made a reservation!');
    },
    error: (model, response) => {
      console.log('Failed to save a trip! Server response:');
      console.log(response);

      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error',`${field}: ${problem}`);
        }
      }
    },
  })
};

$(document).ready(() => {
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
    tripsList.fetch();
  });

  // add trip
  $('#add-trip-form').on('submit', addTripHandler);

  $('#status-messages button.clear').on('click', (event) => {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
})
});

// GAME PLAN
// 7. check out client side validation work on the code
// sorting by...
// Name
// Category
// Continent
// Weeks
// Cost
// user needs to be given some sort of visual feedback that the data has been sorted
/// WAVE 3 /////////
// filtering --- the challenging piece of the project
// 1. figure out the modal situation


// work on continent error handling issues


// done
// Wednesday
// 5. create a button to see a list of trips
// 2. flesh out the details section of html
// 3. figure out how to make the reservation - is it a separate model, how to take in the id to post to the write place
// 6. ask about the API error handling -- i did not have a problem adding a new trip -- no backlash for empty fields (wrong api address)


//Thursday
// 4. work on error handling
