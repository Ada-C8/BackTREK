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
    const generatedHTML = tripsTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};


const renderTripDetails = function renderTripDetails(trip) {

  const tripDivElement = $('#trip-details');
  tripDivElement.html('');

    const generatedHTML = tripsTemplate(trip.attributes);
    console.log(trip);
    console.log(`generatedHTML ${generatedHTML}`);
    console.log(this);
    console.log(`not sure what ${this} is`)
    tripDivElement.append(generatedHTML);

};

const sortTrips = function sortTrips(){
let sortCategory = $(this).attr('class').split(' ')[1];
tripList.comparator = sortCategory;
tripList.sort();
console.log('sorted');
};

$(document).ready( () => {
   tripsTemplate = _.template($('#trips-template').html());
   tripDescriptionTemplate = _.template($('#trips-description-template').html());


  tripList.fetch();

 $('.sort').on('click', sortTrips);
 tripList.on('update', renderTrips);
 tripList.on('sort', renderTrips);


});
