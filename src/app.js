// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

let tripTemplate;
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
});
