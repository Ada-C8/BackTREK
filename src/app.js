// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip-list';

let tripTemplate;

const tripList = new TripList();

const render = function render(tripList) {
  const tripListElement = $('#trip-list tbody');
  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripListElement.append(generatedHTML);
  });
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  render(tripList);

  tripList.on('update', render);
});
