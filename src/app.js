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
// let tripTemplate;
$(document).ready( () => {
  const tripTemplate = _.template($('#trip-template').html());
  $('#all-trips-btn').on('click', showAllTrips, tripList)

});
