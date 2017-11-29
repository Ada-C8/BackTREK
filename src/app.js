// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// CSS
import './css/foundation.css';
import './css/style.css';

const tripList = new TripList();
let tripTemplate;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};

// const continents = ['Africa', 'Antarctica', 'Asia', 'Australasia', 'Europe', 'South America', 'North America', 'Null'];

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  tripList.on('update', render, tripList);

});
