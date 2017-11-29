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
let tripDetailTemplate;

const tripList = new TripList();

const render = function render(tripList) {
  const tripListElement = $('#trip-list tbody');
  tripList.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', show);
    tripListElement.append(generatedHTML);
  });
};

const show = function show(e) {
  const trip = $(e.target).closest('tr');
  const id = trip[0].id;
  const generatedHTML = tripDetailTemplate(trip);
  trip.html(generatedHTML);
};

$(document).ready( () => {
  $('#trip-list').hide();
  tripTemplate = _.template($('#trip-template').html());
  tripDetailTemplate = _.template($('#trip-detail-template').html());

  tripList.on('update', render);

  $('#intro-button').on('click', (e) => {
    $('#intro-button').hide();
    tripList.fetch();
    $('#trip-list').show();
  });
});
