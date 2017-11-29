// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list'
import Trip from './app/models/trip';

console.log('it loaded!');

const tripList = new TripList()

let tripTemplate;

const render = function render(tripList) {
  const tripElement = $('#trip-list');
  tripElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripElement.append(generatedHTML)
  });
};

console.log(tripList);

// Jquery event handling
$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html())

  tripList.on('update', render);
  tripList.fetch()
  console.log(tripList);
  // $('#load-trips').on('click', getTrips)

});
