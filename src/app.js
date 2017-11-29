// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();

let tripTemplate;
let oneTripTemplate;

const render = function render(tripList) {

  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {

    $tripList.append(tripTemplate(trip.attributes));
  });
};
const renderOneTrip = function renderOneTrip(trip) {
  const $trip = $('#one-trip');
  $trip.empty();
  trip.fetch().then(function () {
    $trip.append(oneTripTemplate(trip.attributes));
    $trip.append($('#reserve-trip-form'));
    $('#reserve-trip-form').show();
  });
}
const fields = ['name', 'continent', 'category', 'weeks', 'cost', 'about'];

const events = {
  addTrip(event) {
    event.preventDefault();
    let tripData = {};
    fields.forEach( (field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    });
    const trip = new Trip(tripData);
    tripList.add(trip);
    trip.save({}, {
      success: events.successfullSave,
      error: events.failedSave,
    });
  },
  sortTrips(event) {
    // $('.current-sort-field').removeClass('current-sort-field');
    // $(this).addClass('current-sort-field');
    const classes = $(this).attr('class').split(/\s+/);

    classes.forEach((className) => {
      if (fields.includes(className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        }
        else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });
  },
  successfullSave(trip, response) {
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} failed to be added</li>`);
    for(let key in response.responseJSON.erros) {
      response.responseJSON.erros[key].forEach((error) => {
        $('#status-messages ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#status-messages').show();
    trip.destroy();
  },
};

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());

  oneTripTemplate = _.template($('#one-trip-template').html());

  $('#add-trip-form').submit(events.addTrip);

  $('.sort').click(events.sortTrips);

  $('#all_trips').on('click', () => {
    $('#all-trip-table').show();
  });

  $('#all-trip-table').on('click', '#trip-row', (event) => {
    const tripName = event['currentTarget']['cells'][0]['innerText']
    const trip = tripList.findWhere({name: tripName});
    renderOneTrip(trip);
  });

  tripList.on('update', render, tripList);
  tripList.on('sort', render, tripList);

  tripList.fetch();
});
