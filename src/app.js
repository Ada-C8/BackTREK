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
let aboutTemplate;

// render list of trips
const loadTrips = function loadTrips(tripList) {
  const tripsTableElement = $('#trip-list');
  tripsTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));

    generatedHTML.on('click', (event) => {
      renderTrip(trip);
    });
    tripsTableElement.append(generatedHTML);
  });
  // Provide visual feedback for sorting
  // $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

// render single trip
const renderTrip = function renderTrip(trip) {
  const aboutElement = $('#trip-about');
  aboutElement.html('');

  trip.fetch({
    success: (model) => {
      const generatedHTML = $(aboutTemplate(trip.attributes));
      aboutElement.html(generatedHTML);
    },
  });
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
  aboutTemplate = _.template($('#trip-template').html());

  tripList.on('update', loadTrips);
  tripList.on('sort', loadTrips);
  tripList.fetch();

  // clicking on a single trip in the list
  $('#trip-list').on('click', 'tr', function() {
    console.log('clicked');
    let tripID = $(this).data('id');
    console.log(tripID);
    let singleTrip = new Trip({id: tripID});
    console.log(singleTrip.url());
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
