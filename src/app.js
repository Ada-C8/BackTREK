// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// CLASSES
import Trip from 'app/models/trip';
import TripList from 'app/collections/trip_list';

console.log('it loaded!');

// array of fields for sorting
const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];
// create variable for using in document.ready
const tripList = new TripList();

//define templates
let tripsTemplate;
let backTemplate;
let headTemplate;
let tripTemplate;

const getTrips = function(tripList) {
  let back = backTemplate();
  let tableHead = headTemplate();

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  for (let trip of tripList.models) {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    // generatedHTML.on('click', (event) => {
    //   getTrip(trip);
    // });
    tripTableElement.append(generatedHTML);
  }

  $('.trips thead').html(tableHead);
  $('.back').html(back);
  $('#trips').hide();
} // end of getTrips

const getTrip = function(trip) {
  console.log('get trip');
  console.log(trip);
  let generatedHTML = tripTemplate(trip);
    $('#trip').html(generatedHTML);
} // end of getTrip

$(document).ready( () => {
  //templates
  tripsTemplate = _.template($('#trips-template').html());
  backTemplate = _.template($('#back-button').html());
  headTemplate = _.template($('#tripsHead').html());
  tripTemplate = _.template($('#trip-template').html());

  //get all trips on click
  $('.trips').on('click', '#trips', function() {
    tripList.on('update', getTrips);
    // tripList.on('sort', getTrips);
    tripList.fetch();
  })

  //go back from trips
  $('body').on('click', '.back, #title', function() {
    $('.trips thead').html('');
    $('.trips tbody').html('');
    $('.back').html('');
    $('#trips').show();
  })

  //get trip info
  $('.trips').on('click', 'table tr', function() {
    let tripID = $(this).attr('data-id');
    let trip = tripList.findWhere({ id: parseInt(tripID) });
    trip.fetch({
      success: (model, response) => {
        console.log('success');
        getTrip(response);
      }
    })
  })










}); //end of ready
