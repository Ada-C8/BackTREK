// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './models/trip'

console.log('it loaded!');

const ALL_TRIPS_URL = 'https://ada-backtrek-api.herokuapp.com'; 

$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');
});
