// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//models and collections
import Trip from './models/trip';


console.log('it loaded!');

$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');
});
