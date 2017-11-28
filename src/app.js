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

const tripsList = new TripsList(rawTripData);

const render = function render(tripsList) {
  const tripTableElement = $('#trips-list');
  tripsList.forEach((trip) => {
    const generatedHTML = tripsTemplate(trip.attributes);
    console.log(generatedHTML);
    tripTableElement.append(generatedHTML);
  })
};



// tripsList.fetch();


// let tripTemplate;

let tripsTemplate;


$(document).ready( () => {
  tripsTemplate = _.template($('#trips-template').html());

  // tripTemplate = _.template($('#trip-template').html());

  render(tripsList);

});
