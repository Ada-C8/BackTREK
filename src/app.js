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
    console.log(`Trip already has information available`);
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

const reportStatus = function reportStatus(status, field, problem) {
  console.log('in reportStatus function');
  console.log(`Reporting ${ status } status: ${ field } problem: ${problem}`);
  const errorSpanElement = $(`#form-${field}`)
  errorSpanElement.html('');
  const generatedHTML = $(statusTemplate({'problem': problem }));
  errorSpanElement.append(generatedHTML);
};

const clearFormMessages = function clearFormMessages() {
  $('#add-trip-form span').html('')
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
    console.log(`Invalid Trip`);
    handleValidationFailures(trip.validationError);
    return;
  }

  tripList.add(trip);

  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved Trip!');
      $('#myModal').hide();
      $(`#add-trip-form input`).val('');
      // TODO: get line of code above working
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save bookTrip! Server response:');
      console.log(response);

      tripList.remove(model);
      console.log(response.responseJSON["errors"]);
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};

const readResFormData = function readResFormData(){
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    if (value != '') {
      tripData[field] = value;
    }

  });
  console.log("Read trip data");
  console.log(tripData);

  return tripData;
};

const render = function render(tripList) {
  const tripTableElement = $('#trip-list');

  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', (event) => {
      renderDetails(trip);
    });
    tripTableElement.append(generatedHTML);
  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};
