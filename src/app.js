// TODO: styles
// TODO: better error handling
// TODO: filtering
// TODO: showing sorting on user click with style feedback

// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';

const tripList = new TripList();

const TRIP_FIELDS = ["id", "about", "name", "continent", "category", "weeks", "cost"];
const RES_FIELDS = ["trip_id","name","email"];

// variables for underscore templates
let tripTemplate;
let detailsTemplate;
let statusTemplate;

// function to report client and server side user feedback for both trip and reservation forms
const reportStatus = function reportStatus(status, field, problem) {
  console.log('in reportStatus function');
  // fail status
  if (status === 'error') {
    console.log('error');
    console.log(`Reporting ${ status } status: ${ field } problem: ${problem}`);
    const errorSpanElement = $(`.form-${field}`)
    errorSpanElement.html('');
    const generatedHTML = $(statusTemplate({'problem': `${problem}` }));
    errorSpanElement.append(generatedHTML);
  } else {
    // success status
    console.log('success');
    console.log(`Reporting ${ status } status: ${ field } `);
    const messageHook = $('#success p')
    messageHook.html('');
    const generatedHTML = `${field}`
    messageHook.append(generatedHTML);
    $('#success').css("display", "inline");
  }
};

// function to clear inline error handling messages in forms
const clearFormMessages = function clearFormMessages() {
  $('#add-trip-form span').html('')
  $('#reservation-form span').html('')
};

const handleValidationFailures = function handleValidationFailures(errors) {
  clearFormMessages();
  console.log('in handleValidationFailures function');
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', field,  problem);
    }
  }
};

// function to add a trip
const addTripHandler = function(event) {
  console.log('addTripHandler entered');
  event.preventDefault();

  // client side validation
  const trip = new Trip(readFormData(this.id));
  if (!trip.isValid()) {
    console.log(`trip is not valid!`);
    handleValidationFailures(trip.validationError);
    return;
  }

  tripList.add(trip);

  // server side validation
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved Trip!');
      console.log('passed server side validation');
      // hide modal and clear form values
      $('#myModal').hide();
      $(`#add-trip-form input`).val('');
      // show success status
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log('Failed server side validation');

      // remove bad trip from the list
      tripList.remove(model);
      console.log(response.responseJSON["errors"]);
      // show inline errors in form
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};


// function to read form data for both forms, just need to pass in form-id arg
const readFormData = function readFormData(formId){
  console.log('in readFromData function');
  const data = {};

  // ternary operator to assign which field attributes variable should be used
  let fields = formId.includes("trip") ? TRIP_FIELDS : RES_FIELDS
  fields.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#${formId} input[name="${ field }"]`);
    const value = inputElement.val();

    // Don't take empty strings, so that Backbone can fill in default values
    if (value != '') {
      data[field] = value;
    }
  });

  return data;
};

const renderDetails = function renderDetails(trip){
  const detailsElement = $('#trip-details');
  // clear details section
  detailsElement.html('');

  // if we already have updated data from API don't make call otherwise fetch new data
  if (trip.get('about')) {
    const generatedHTML = $(detailsTemplate(trip.attributes));
    detailsElement.append(generatedHTML);
    console.log(`my trip already has info`);
  } else {
    trip.fetch({
      success: (model) => {
        const generatedHTML = $(detailsTemplate(trip.attributes));
        detailsElement.append(generatedHTML);
        console.log(trip);
        console.log(trip.attributes);
      }
    });
  }
  // updates reservation from trip id value
  $('form input#trip_id').attr('value' , `${trip.attributes.id}`);
};

const render = function render(tripList) {
  // iterate through tripList, generate HTML for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');

  // clears the html so when we dynamically render again we get a new list vs just adding on
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', (event) => {
      renderDetails(trip);
    });
    tripTableElement.append(generatedHTML);
  });
};

// function to make a reservation
const addReservationHandler = function(event) {
  console.log('In addReservationHandler function');
  event.preventDefault();
  clearFormMessages();
  const reservation = new Reservation(readFormData(this.id))

  // client side validation
  if (!reservation.isValid()) {
    console.log(`reservation is not valid!`);
    handleValidationFailures(reservation.validationError);
    return;
  }

  // server side validation
  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved Reservation!');
      // console.log('passed server side validation');
      // clearn form values
      $(`#clear-me input`).val('');
      reportStatus('success', 'Successfully saved reservation!');
    },
    error: (model, response) => {
      console.log('Failed to save reservation! Server response:');
      // console.log('Failed server side validation');

      // Server-side validations failed, so remove this bad trip from the list
      console.log(response.responseJSON["errors"]);
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};



$(document).ready( () => {
  let modal = $('#myModal');

  // compiled underscore templates
  detailsTemplate = _.template($('#details-template').html());
  tripTemplate = _.template($('#trip-template').html());
  statusTemplate = _.template($('#status-message-template').html());

  // adding new models to a collection triggers an update event
  tripList.on('update', render);

  // get all of the trips from the API
  tripList.fetch();

  // EVENTS
  $('#add-trip-form').on('submit', addTripHandler);
  $('#reservation-form').on('submit', addReservationHandler);

  // MODAL
  // displays modal on button click
  $('#add-trip-button').on('click', function() {
    modal.css("display", "block");
  });

  // hides modal on click for things with correct class
  $('body').on('click', '.modal-close', function(event){
    if($(event.target).hasClass('modal-close')) {
      modal.hide();
      $('#success').hide()
      // TODO: make it so that when you close modal form resets if you havent finished
      clearFormMessages();
    }
  });
});
