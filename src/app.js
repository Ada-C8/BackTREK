// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripsList from './app/collections/trips_list.js';
import Trip from './app/models/trip.js';


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

const tripsList = new TripsList();
tripsList.fetch();


let tripTemplate;

let tripsTemplate;


$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');

  tripsTemplate = _.template($('#trips-template').html());

  tripTemplate = _.template($('#trip-template').html());
});
