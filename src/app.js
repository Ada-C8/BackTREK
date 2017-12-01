// Filtering
//
// Add a form to the top of your trip list. The form should have a dropdown to select Name, Category, Continent, Cost or Weeks, as well as a text box.
//
// When the user types in the text box, the list of trips will be filtered to only show trips that match.
//
// For a text field (Name, Category, Continent), the trip's value for that field should include the filter value.
// Filtering for Continent asia should match both Asia and Australasia
// For a numeric field (Weeks, Cost), the trip's value for that field should be less than or equal to the filter value.
// The list of displayed trips should be updated with every keystroke. This means that making a new query against the API every time will be too slow. Instead, you should filter your list in JavaScript, probably via a custom method on the collection.
//
// Your app should gracefully handle the case where none of the trips match the filter.
//
// This feature is complex - it's what brings this project from stage 1 to stage 2. Spend some time thinking it through before you start writing code. What data needs to be where, how will code be organized, and how are you going to avoid stepping on your own feet?
//

//Inline Validations
//Validations and Error Handling for Reservations


// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';


import TripList from './app/collections/trip_list';
import Trip from './app/models/trip'
import Reservation from './app/models/reservation'

const TRIP_FIELDS = ['name', 'continent', 'weeks', 'category', 'about', 'cost'];

const RESERVATION_FIELDS = ['name', 'email', 'tripId']

const tripList = new TripList();

let tripTemplate;
let aboutTemplate;

const loadTrip = function loadTrip(singleTrip) {
  const aboutTableElement = $('#about');
  const thisTrip = singleTrip.fetch({
    success: (model) => {
      console.log(model);
      const generatedHTML = aboutTemplate(model.attributes)
      aboutTableElement.html('')
      aboutTableElement.append(generatedHTML);
      //why is this automatically submitting?
      $('#add-reservation-form').on('submit', addReservationHandler);
    }
  });
};

const loadTrips = function loadTrips(tripList, filters) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  // console.log('LOGGING Filters:');
  // console.log(filters);
  //don't do this but its an idea?
  const listOfTrips = tripList.filterTrips(filters);
  console.log(listOfTrips);

  listOfTrips.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', (event) => {
      $('.trip').removeClass('selected-trip')
      generatedHTML.addClass('selected-trip')
      loadTrip(trip)
    })
    tripTableElement.append(generatedHTML);
  });

  if(tripTableElement.html === '') {
    console.log(LOSER);
    tripTableElement.append('LSE')
  }

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};


const addReservationHandler = function(trip) {
  event.preventDefault();

  const reservation = new Reservation(readReservationData());

  console.log('about to check validations!!!!!!!');
  if (!reservation.isValid()) {
    console.log('didnt get in here obviously');
    handleReservationValidationFailures(reservation.validationError);
    return;
  }

  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved reservation!');
      $('#reservation-status').html('');
      $('#reservation-status').addClass('success')
      $('#add-reservation-form').hide('slow')
      reportReservationStatus('success', 'Successfully saved reservation!');
    },

    error: (model, response) => {
      console.log('Failed to save reservation! Server response:');
      $('#reservation-status').removeClass('success');
      $('#reservation-status').addClass('failure');

      handleValidationFailures(response.responseJSON["errors"]);

    },
  });
};

const readReservationData = function readReservationData() {
  const reservationData = {};
  RESERVATION_FIELDS.forEach((field) => {
    console.log(field);
    const inputElement = $(`#add-reservation-form input[name="${ field }"]`);
    const value = inputElement.val();
    console.log(value);
    if (value != '') {
      reservationData[field] = value;
    }
    // making the tripId equal an empty string
    // inputElement.val('');
  });
  console.log(reservationData);
  return reservationData;
}

const handleReservationValidationFailures = function handleValidationFailures(errors) {
  // Since these errors come from a Rails server, the strucutre of our
  // error handling looks very similar to what we did in Rails.

  console.log('in handlereservationvalidation');
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportReservationStatus('error', `${field}: ${problem}`);
    }
  }
};

const reportReservationStatus = function reportReservationStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);
  // Should probably use an Underscore template here.
  const statusHTML = `<p class="${ status }">${ message }</p>`;
  console.log(statusHTML);
  // note the symetry with clearStatus()
  // $('#reservation-status').html('');

  $('#reservation-status').append(statusHTML);
  $('#reservation-status').removeClass('success')

  $('#reservation-status').addClass('failure')
  $('#reservation-status').show();
};


const addTripHandler = function(event) {
  event.preventDefault();
  // $('#myModal').removeClass('block')
  // $('#add-trip-form').removeClass('none')
  $('#status-messages').html('')
  console.log('in addtriphandler');

  const trip = new Trip(readFormData());
  console.log(trip);

  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }
  console.log('about to add!');
  console.log(trip);

  //in response to API validations, not to model validations
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      console.log(trip);
      tripList.add(trip);
      $('#status-messages').addClass('success')
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      //NEED TO FIND A WAY TO
      $('#status-messages').removeClass('success')
      $('#status-messages').addClass('failure')
      $('#status-messages').append(`Failed to save trip`)
      console.log(response);
      tripList.remove(model)

      handleValidationFailures(response.responseJSON["errors"]);
    },
  });

};

const readFormData = function readFormData() {
  const tripData = {};

  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    let inputElement = $(`#add-trip-form input[name="${ field }"]`);

    if(field == 'continent') {
      inputElement = $(`#add-trip-form select[name="${ field }"]`);
      console.log(inputElement);
      console.log(inputElement);
      const string = inputElement.val();
      const value = string.charAt(0).toUpperCase() + string.slice(1)
      console.log(value);
      if (value != '') {
        tripData[field] = value;
      }
      inputElement.val('');
    }
    else if(field == 'weeks') {
      const value = parseInt(inputElement.val());
      console.log(`week: ${value} ${typeof value}`);
      if (value != '') {
        tripData[field] = value;
      }
      inputElement.val('');
    }
    else if(field == 'cost') {
      const value = parseInt(inputElement.val());
      if (value != '') {
        tripData[field] = value;
        console.log(tripData[field]);
      }
      inputElement.val('');
    } else {
      const value = inputElement.val();
      if (value != '') {
        tripData[field] = value;
      }
      inputElement.val('');
    }
  });

  return tripData;
};

const handleValidationFailures = function handleValidationFailures(errors) {
  // Since these errors come from a Rails server, the strucutre of our
  // error handling looks very similar to what we did in Rails.
  console.log('inhandlevalidationfaiilurs');
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);

  // Should probably use an Underscore template here.
  const statusHTML = `<p class="${ status }">${ message }</p>`;

  // note the symetry with clearStatus()
  $('#status-messages').append(statusHTML);
  $('#status-messages').removeClass('success')

  $('#status-messages').addClass('failure')
  $('#status-messages').show();
};


const clearStatus = function clearStatus() {
  $('#status-messages').html('');
  $('#status-messages').hide();
};

const readFilterForm = function readFilterForm() {

}


$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  aboutTemplate = _.template($('#about-template').html());
  let filters = {}

  tripList.on('update', loadTrips);
  tripList.on('sort', function() {
    loadTrips(tripList, filters)
  });

  $('#filter').on('keyup', function(event) {
    filters[$('#filter option:selected')[0].innerHTML] = $('#filter input')[0].value;
    loadTrips(tripList, filters)
  })

  tripList.fetch();

  $('#add-trip-form').on('submit', addTripHandler)


  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      tripList.comparator = field;
      tripList.sort();
    });
  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${tripList.comparator }`).addClass('current-sort-field');


  // Get the modal
  const modal = document.getElementById('myModal');
  // Get the button that opens the modal
  const btn = document.getElementById("add-trip");
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    console.log('inside onclick');
    // $(.'modal-content').removeClass('none');
    $(modal).removeClass('none');
    $(modal).addClass('block');
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    $(modal).removeClass('block');
    $(modal).addClass('none');
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      $(modal).removeClass('block');
      $(modal).addClass('none');
    }
  }

  // $('#status-messages button.clear').on('click', clearStatus);

});
