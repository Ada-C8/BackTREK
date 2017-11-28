// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip'

console.log('it loaded!');

const newTrip = new Trip({
  name: "Here to There",
  continent: "Here",
  category: "There",
  duration: "4",
  cost: "45",
})

console.log(newTrip.get('name'));
console.log(newTrip.get('cost'));

$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');

  $('#all-trips').click(function() {
    buildAllTrips();
  });
});
