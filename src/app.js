// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';

const TRIP_FIELDS = ['name', 'continent', 'weeks'];
const DEET_FIELDS = ['name', 'continent', 'weeks', 'category', 'cost', 'about'];

const tripList = new TripList();
let tripTemplate;
let tripDetails;

// RENDER
const render = function render(tripList) {
  const tripTbody = $('#trip-list');
  tripTbody.html('');

  tripList.forEach((trip) => {
    const generatedHtml = tripTemplate(trip.attributes);
    tripTbody.append(generatedHtml);
  });
};

// JQUERY
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripDetails = _.template($('#detail-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);

  tripList.on('update', render);
  // tripList.on('sort', render);
  // tripList.on('click', render);
  tripList.fetch();

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      tripList.comparator = field;
      tripList.sort();
    })
  });
});

// $('#trip-list').on('click', 'a', function(event) {
//   let id = $(this).find('.trip-item td[id^=trip]').attr("class");
//   console.log(id);
// });

// $('.trip-item td[id^=trip]').on('click', function(event) {
//   let id = $(this).attr("class");
//   id = id.slice(8);
//   id = parseInt(id);
//   let reserve_url = `https://ada-backtrek-api.herokuapp.com/trips/${id}`;
//
//   // tripList.url = reserve_url
//   console.log(reserve_url);
//   // tripList.fetch();
// });

$('tbody#trip-list').on('click', 'a', function() {
  let tripID = $(this).attr('data-id');
  loadTrip(tripID);
});

let loadTrip = function loadTrip(id) {

  let url = `https://ada-backtrek-api.herokuapp.com/trips/${id}`
  $.get(`${url}`, function(data) {
    data.category = data.category.charAt(0).toUpperCase() + data.category.slice(1);
    data.cost = parseFloat(Math.round(data.cost * 100) / 100).toFixed(2);

    const tripDiv = $('#trip-details');
    tripDiv.html('');

    console.log(url);
    console.log(tripDetails);
    console.log(tripDetails.attributes);

    const generatedHtml = tripDetails(attributes);
    tripDiv.append(generatedHtml);

  });
};
