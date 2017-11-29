// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripsList from './app/collections/trips_list.js';
import Trip from './app/models/trip.js';

// variable declarations and functions

const tripsList = new TripsList();

const render = function render(tripsList) {
  const tripTableElement = $('#trips-list');
  tripsList.forEach((trip) => {
    const generatedHTML = tripsTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  })
};

let tripsTemplate;

// let tripTemplate;


$(document).ready( () => {
  tripsTemplate = _.template($('#trips-list-template').html());
  // tripTemplate = _.template($('#trip-template').html());

  tripsList.on('update', render);

  tripsList.fetch();

});
