// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';

console.log('it loaded!');

const tripList = new TripList()
// const trip = new Trip()
// const res = new Reservation()

const TRIP_FIELDS = ['name', 'category', 'continent', 'weeks', 'cost', 'about'];
const RES_FIELDS = ['name', 'email'];


let tripsTemplate;
let tripDetailTemplate;

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

const render = function render(tripList) {
  const $tripsElement = $('#trip-list');
  $tripsElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    generatedHTML.on('click', (event) => {
      console.log('testing click');
      $('#trips').hide()
      $('#trip').show()
      // due to asynchonous api responses we put the renderTrip into the .fetch()
      trip.fetch({
        success(model, response) {
          renderTrip(model);
        }
      });

    })
    $tripsElement.append(generatedHTML)
  });
};


const renderTrip = function renderTrip(trip) {
  const $tripElement = $('#trip');
  $tripElement.html('');
  console.log(trip.attributes);
  // console.log(trip.attributes.about);

  const generatedDetailHTML = tripDetailTemplate(trip.attributes);
  $tripElement.html(generatedDetailHTML)
}

const loadTrips = function loadTrips() {
  tripList.fetch({
    success(model, response) {
    render(model);
    }
  });
};

const readTripFormData = function readTripFormData() {
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const $inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = $inputElement.val();

    // Don't take empty strings, so that Backbone can
    // fill in default values
    if (value != '') {
      tripData[field] = value;
    }

    $inputElement.val('');
  });

  console.log("Read trip data");
  console.log(tripData);

  return tripData;
};

const readResFormData = function readResFormData() {
  const resData = {};
  RES_FIELDS.forEach((field) => {
    const $inputResElement = $(`add-res input[name="${ field }"]`);
    const value = $inputResElement.val();

    if (value != '') {
      resData[field] = value;
    }

    $inputResElement.val('');
  });
console.log("Read res data");
console.log(resData);
};

const handleValidationFailures = function handleValidationFailures(errors) {
  // Since these errors come from a Rails server, the strucutre of our
  // error handling looks very similar to what we did in Rails.
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};


const addTripHandler = function(event) {
  event.preventDefault();
  console.log('addTripHandler test click');

  const trip = new Trip(readTripFormData());

  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }

  tripList.add(trip);

  // The first argument to .save is the attributes to save.
  // If we leave it blank, it will save all the attributes!
  // (Think of model.update in Rails, where it updates the
  // model and saves to the DB in one step). We need the second
  // argument for callbacks, so we pass in {} for the first.
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);

      // Server-side validations failed, so remove this bad
      // trip from the list
      tripList.remove(model);

      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};

const addResHandler = function addResHandler(event) {
  event.preventDefault();
  console.log('click into addResHandler');

  const res = new Reservation(readResFormData());

  if (!res.isValid()) {
    handleValidationFailures(res.validationError);
    return;
  }

  res.save({}, {
    success: (model, response) => {
      console.log('Successfully saved res');
      reportStatus('success', 'Successfully saved reservation!');
    },
    error: (model, response) => {a
      console.log('Failed to save res. Server response: ');
      console.log(response);

      handleValidationFailures(response.responseJSON["errors"]);
    }
  })
}

// Jquery event handling
$(document).ready( () => {
  tripsTemplate = _.template($('#trip-template').html());
  tripDetailTemplate = _.template($('#trip-detail-template').html());

  $('#trips').hide();

  $('#trip').on('click', 'tr', renderTrip);

  $('#load-trips').on('click', function (){
    $('#trips').show();
    loadTrips()

  });

  $('#add-trip-form').on('submit', addTripHandler);

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  $('#status-messages button.clear').on('click', clearStatus);

});
