// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
import TripList from './app/collections/tripList';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

const tripList = new TripList();

$(document).ready( () => {
  const tripTemplate = _.template($('#tripTemplate').html());


});
