// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// OUR COMPONENTS
import TripList from './collections/trip_list';

// TRIP FIELDS
const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();
let tripTemplate;

const render = function render(tripList) {
  // iterate through the tripList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const addBookHandler = function(event) {
  event.preventDefault();

  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;

    inputElement.val('');
  });

  console.log("Read trip data");
  console.log(tripData);

  const trip = tripList.add(tripData);
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
    },
  });
};

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);

  // Register our update listener first, to avoid the race condition
  tripList.on('update', render);
  tripList.on('sort', render);

  // When fetch gets back from the API call, it will add trips
  // to the list and then trigger an 'update' event
  tripList.fetch();

  // Listen for when the user adds a trip
  $('#add-trip-form').on('submit', addBookHandler);

  // Add a click handler for each of the table headers
  // to sort the table by that column
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });
});
