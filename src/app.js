// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// OUR COMPONENTS
import TripList from './collections/trip_list';
import Trip from './models/trip';

// TRIP FIELDS
const TRIP_FIELDS = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();
let tripsTemplate;
let tripTemplate;

const render = function render(tripList) {
  // iterate through the tripList, generate HTML for each model, attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripsTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  // Provide visual feedback for sorting
  // $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

// const addTripHandler = function(event) {
//   event.preventDefault();
//
  // const tripData = {};
  // TRIP_FIELDS.forEach((field) => {
  //   // select the input corresponding to the field we want
  //   const inputElement = $(`#add-trip-form input[name="${ field }"]`);
  //   const value = inputElement.val();
  //   tripData[field] = value;
  //
  //   inputElement.val('');
  // });

  // const trip = tripList.add(tripData);
  // trip.save({}, {
  //   success: (model, response) => {
  //     console.log('Successfully saved trip!');
  //   },
  //   error: (model, response) => {
  //     console.log('Failed to save trip! Server response:');
  //     console.log(response);
  //   },
  // });
// };

$(document).ready(() => {
  tripsTemplate = _.template($('#trips-template').html());
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', render);
  tripList.on('sort', render);

  tripList.fetch();


  // clicking on a single trip in the list
  $('#trip-list').on('click', 'tr', function() {
    console.log('clicked');
    let tripID = $(this).data('id');
    console.log(tripID);
  })

  // $('#add-trip-form').on('submit', addTripHandler);
  //
  // TRIP_FIELDS.forEach((field) => {
  //   const headerElement = $(`th.sort.${ field }`);
  //   headerElement.on('click', (event) => {
  //     console.log(`Sorting table by ${ field }`);
  //     tripList.comparator = field;
  //     tripList.sort();
  //   });
  // });
});
