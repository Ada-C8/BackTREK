// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';

console.log('it loaded!');

let tripsTemplate;

const tripList = new TripList();


const render = function renderTrips(tripList) {

  const tripTableElement = $('#trips-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

console.log(tripList);


$(document).ready( () => {
   tripsTemplate = _.template($('#trips-template').html());
  $('main').html('<h1>Hello World!</h1>');

  tripList.fetch();


 tripList.on('update', renderTrips);
});
