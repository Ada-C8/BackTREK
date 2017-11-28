// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './models/trip';
import TripList from './collections/trip_list';


console.log('it loaded!');

$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');
});
