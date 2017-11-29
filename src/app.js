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
  const tripListElement = $('#trip-list ul');
  tripList.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', show);
    tripListElement.append(generatedHTML);
  });
};

const show = function show(e) {
  const tripElement = $(e.target).closest('li');
  const id = tripElement[0].id;
  const trip = tripList.findWhere({id: 2});
  trip.fetch({
    success: () => {
      const generatedHTML = tripDetailTemplate(trip.attributes);
      tripElement.append(generatedHTML);
    }
  });
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
