// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// CLASSES
import TripList from 'app/collections/trip_list';

console.log('it loaded!');

// array of fields for sorting
const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];
// create variable for using in document.ready
const tripList = new TripList();
// create variable and set it in document.ready

//define templates
let tripTemplate;
let backTemplate;
let headTemplate;

const getTrips = function(tripList) {
  let back = backTemplate();
  let tableHead = headTemplate();

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  for (let trip of tripList.models) {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  }

  // $('.trips thead').html(tableHead);
  // $('.back').html(back);
  // $('#trips').toggle();
} // end of getTrips

const getTrip = function() {

} // end of getTrip



$(document).ready( () => {
  //templates
  tripTemplate = _.template($('#trip-template').html());
  backTemplate = _.template($('#back-button').html());
  headTemplate = _.template($('#tripsHead').html());

  //get all trips on click
  $('.trips').on('click', '#trips', function() {
    tripList.on('update', getTrips);
    tripList.on('sort', getTrips);
    tripList.fetch();
  })

  //go back from trips
  $('body').on('click', '.back, #title', function() {
    $('.trips table').html('');
    $('.back').html('');
    // $('#trips').toggle();
  })









}); //end of ready
