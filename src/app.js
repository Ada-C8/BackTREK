// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();

let tripTemplate;

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    // console.log(`Rendering trip ${trip.get('name')}`);
    let tripHTML = tripTemplate(trip.attributes);
    tripListElement.append($(tripHTML));
  });
};


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('sort', render, tripList);
  tripList.fetch();

});
