// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from 'app/models/trip.js'
import TripList from 'app/collections/tripList.js'

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

const tripList = new TripList();

const TRIP_FIELDS = [ 'id', 'name', 'continent', 'category', 'weeks','cost', 'about']

const render = function render(tripList) {
  console.log(tripList);
  tripList.forEach((trip) => {
    let currentTrip = new Trip({id: trip.id});
    currentTrip.fetch().done(function() {
      console.log(currentTrip.attributes);
      const tripTemplate =  _.template($('#trip-template').html());
      const tripHTML = tripTemplate(currentTrip.attributes);

      $('#trip-list').append(tripHTML);
      let id = currentTrip.get('id')
      console.log(`.current-trip-${id}`);
    });
  });
};

const tripDetailHandler = function (event){
  console.log(event.target.parentElement.id);
  let id = event.target.parentElement.id;
  $(`.details-${id}`).toggleClass('hide');
  $(`.button-${id}`).toggleClass('hide');
}

const reserveFormUpdate = function (event){
  console.log(event.target.parentElement.className);
  let id = event.target.parentElement.className

  let currentTrip = new Trip({id: id});
  currentTrip.fetch().done(function() {
    const formTemplate =  _.template($('#form-template').html());
    console.log(formTemplate);
    const formHTML = formTemplate(currentTrip.attributes);
    // $('.form-container').removeClass('hide');
    $('#form-container').html(formHTML);
  });
}

const addTripHandler = function(event){
  event.preventDefault();
  const trip = new Trip(readFormData());
  console.log('I am getting ready to make a trip!')
  console.log(trip.attributes)
  tripList.add(trip);
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportStatus('success', 'Successfully saved book!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      tripList.remove(model);

       handleValidationFailures(response.responseJSON["errors"]
      );
    },
  });
};

const handleValidationFailures = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
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

const readFormData = function readFormData() {
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    if (value != '') {
      tripData[field] = value;
    }
    inputElement.val('');
  });
  console.log("Read trip data");
  console.log(tripData.attributes);
  return tripData;
};



$(document).ready( () => {
  tripList.fetch().done(function() {
    console.log('done');
    render(tripList);
    let currentTrip = new Trip();
  });

  $('#trip-list').on('click', 'button', tripDetailHandler);

  $('#trip-list').on('click', '.reserve', reserveFormUpdate)
  // $('.new-trip-button').on('click', addReservationHandler);

  $('#add-trip-form').on('submit', addTripHandler)
});
