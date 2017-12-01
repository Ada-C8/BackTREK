// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';

const tripList = new TripList();

const TRIP_FIELDS = ["id", "about", "name", "continent", "category", "weeks", "cost"];

let tripTemplate;
let detailsTemplate;
let statusTemplate;

const renderDetails = function renderDetails(trip){
  const detailsElement = $('#trip-details');
  detailsElement.html('');

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
};

// Add a new status message
const reportStatus = function reportStatus(status, field, problem) {
  console.log('in reportStatus function');
  console.log(`Reporting ${ status } status: |${ field }| problem ${problem}`);

  let errors = {'problem': problem };
  // console.log(errors);
  const errorSpanElement = $(`#form-${field}`)
  errorSpanElement.html('');
  console.log(errorSpanElement);
  const generatedHTML = $(statusTemplate(errors));
  console.log(generatedHTML);
  errorSpanElement.append(generatedHTML);
  // // Should probably use an Underscore template here.
  // const statusHTML = `<li class="${ status }">${ message }</li>`;
  //
  // // note the symetry with clearStatus()
  // $('#status-messages ul').append(statusHTML);
  // $('#status-messages').show();
};

const handleValidationFailures = function handleValidationFailures(errors) {
  console.log('in handleValidationFailures function');
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', field,  problem);
    }
  }
};

const addTripHandler = function(event) {
  console.log('addTripHandler entered');
  event.preventDefault();

  const trip = new Trip(readResFormData());
  if (!trip.isValid()) {
    console.log(`trip is not valid!`);
    handleValidationFailures(trip.validationError);
    return;
  }

  // console.log();
};



const readResFormData = function readResFormData(){
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    // Don't take empty strings, so that Backbone can fill in default values
    if (value != '') {
      tripData[field] = value;
    }

    inputElement.val('');
  });
  console.log("Read trip data");
  console.log(tripData);

  return tripData;
};

const render = function render(tripList) {
  // iterate through the bookList, generate HTML
  // for each model and attatch it to the DOM
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

  // MODAL
  // displays modal on button click
  $('#add-trip-button').on('click', function() {
    modal.css("display", "block");
  });

  // hides modal on click for things with correct class
  $('body').on('click', '.modal-close', function(event){
    if($(event.target).hasClass('modal-close')) {
      modal.hide();
    }
  });
});
