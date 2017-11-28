// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './collections/trip_list';
import Trip from './models/trip';


const rawTripData = [
  {
    name: "Cairo to Zanzibar",
    continent: "Africa",
    about: 'So Awesome!',
    weeks: 5,
    cost: 9599.99
  }, {
    name: "Espana",
    continent: "Europe",
    about: "Motherland!",
    weeks: 6,
    cost: 'free'
  }
]

const tripList = new TripList(rawTripData);

let tripTemplate;

let tripsTemplate;


$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');

  tripTemplate = _.template($('#trip-template').html());
});
