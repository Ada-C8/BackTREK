// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip-list';

let tripTemplate;

let tripList = new TripList();

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  console.log(tripList);
});
