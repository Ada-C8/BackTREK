// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';

console.log('it loaded!');

let tripsTemplate;
let tripDescriptionTemplate;

const tripList = new TripList();


const renderTrips = function renderTrips(tripList) {

  const tripTableElement = $('#trips-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    tripTableElement.append(generatedHTML);
    generatedHTML.on('click', (event) =>{
      renderTripDetails(trip);
    });
  });

  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};


const renderTripDetails = function renderTripDetails(trip) {

  const tripDivElement = $('.side-bar');
  tripDivElement.html('');
  trip.fetch({
    success: (model) => {
    const detailsHTML = $(tripDescriptionTemplate(trip.attributes));
    tripDivElement.append(detailsHTML);
    }
  });

  console.log(trip);
  console.log($(this).attr('class'));
};

const sortTrips = function sortTrips(){
  let sortCategory = $(this).attr('class').split(' ')[1];
  tripList.comparator = sortCategory;
  tripList.sort();
  console.log('sorted');
};

const singleTrip = function singleTrip(tripId){
  console.log(`tripId is ${tripId}`)
  let singleTripVar = tripList.findWhere({id: tripId});
  console.log(singleTripVar);
};


$(document).ready( () => {
  tripsTemplate = _.template($('#trips-template').html());
  tripDescriptionTemplate = _.template($('#trips-description-template').html());

  tripList.fetch();

  $('.sort').on('click', sortTrips);
  // $('.trip').on('click', singleTrip(`${$(this).attr('id')}`));
  tripList.on('update', renderTrips);
  tripList.on('sort', renderTrips);


});
