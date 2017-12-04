// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from 'app/collections/trip_list';
import Trip from 'app/models/trip';


const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

// Clear status messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);

  // Should probably use an Underscore template here.
  const statusHTML = `<li class="${ status }">${ message }</li>`;

  // note the symetry with clearStatus()
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

const tripList = new TripList();
// initalize templates
let listTemplate;
let tripTemplate;
let reserveTemplate;

const renderTrips = function renderTrips(list) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  console.log(`tripList :${list}`);
  list.forEach((trip) => {
    const generatedHTML = $(listTemplate(trip.attributes));
    // adding event handler here gives context as to which trip needs to be clicked
    generatedHTML.on('click', (event) => {
      const tripDetails = new Trip({id: trip.get('id')})
      // grab backbone object and pass into function

      tripDetails.fetch(
        {
          success: function(trip) {
            console.log('worked');
            renderTrip(trip);
          },
          error: function(message, b) {
            console.log(message, b);
          }
        }); // end of fetch
      })
      tripTableElement.append(generatedHTML);
    });
  };

  const renderReserve = function renderReserve() {
    const reserveForm = $('#reserve-form');
    reserveForm.html('');
    const generatedHTML = reserveTemplate();
    console.log(generatedHTML);
    reserveForm.append(generatedHTML);
  }

  const renderTrip = function renderTrip(trip) {
    const tripElement = $('#trip');
    // clears html in tripElement
    tripElement.html('');
    const generatedHTML = tripTemplate(trip.attributes);
    tripElement.append(generatedHTML);

    $('#reserve').on('click', (event) => {
      renderReserve();
    });
  }

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${tripList.comparator}`).addClass('current-sort-field');

  const readFormData = function readFormData() {
    const tripData = {};

    TRIP_FIELDS.forEach((field) => {

      const inputElement = $(`#add-trip-form input[name="${field}"]`);
      const value = inputElement.val();

      if (value != '') {
        tripData[field] = value;
      }
      inputElement.val('');
    });
    console.log("reading trip data");
    console.log(tripData);
    return tripData;
  };


  const outputValidationFailures = function outputValidationFailures(errors) {
    for (let field in errors) {
      for (let problem of errors[field]) {
        reportStatus('error', `${field}: ${problem}`);
      }
    }
  };
  const addTripHandler = function(event) {
    event.preventDefault();

    const trip = new Trip(readFormData());

    if (!trip.isValid()) {
      outputValidationFailures(trip.validationError);
      return;
    }
    tripList.add(trip);

    trip.save({}, {
      success: (model, response) => {
        console.log('successfully saved trip');
        reportStatus('success', 'Successfully saved trip!');
      },
      error: (model, response) => {
        console.log('failed to save trip');
        console.log(response);
        // removes from list if fails validations
        tripList.remove(model);
        outputValidationFailures(response.responseJSON["errors"]);
      },
    });
  };

  $(document).ready( () => {
    // compile underscore templates
    listTemplate = _.template($('#list-template').html());
    tripTemplate = _.template($('#trip-template').html());
    reserveTemplate = _.template($('#reserve-template').html());

    tripList.on('sort', renderTrips);
    tripList.fetch();

    $('#add-trip-form').on('submit', addTripHandler);

    $('#trips').on('click', () => {
      $('#trip-list').toggle();
      renderTrips(tripList);
    });

    $('#add-trip').on('click', () => {
      console.log('clicked add trip');
      $('.add-trip-form').toggle();
    });

    TRIP_FIELDS.forEach((field) => {
      const headerElement = $(`th.sort.${field}`);
        headerElement.on('click', (event) => {
          console.log(`sorting table by ${field}`);
          tripList.comparator = field;
          tripList.sort();
        });
    });
    $('#status-messages').on('click', clearStatus);
  }); // end doc.ready
