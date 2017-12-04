// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();

let tripTemplate;
let showTemplate;

const fields = ['name', 'continent', 'category', 'weeks', 'cost'];

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    tripListElement.append(tripTemplate(trip.attributes));
  });
};

const events = {
  allTrips(event) {
    const tripListElement = $('#trip-list');
    tripListElement.empty();
    $('h2').text('Trip Options');
    $('#load_trips').show();
    tripList.forEach((trip) => {
      let tripHTML = tripTemplate(trip.attributes);
      tripListElement.append($(tripHTML));
    });
  },

  loadTrip(id) {
    const singleTripElement = $('#single-trip');
    singleTripElement.empty();
    const trip = new Trip({id: id});

    $('h3').text('Trip Info');

    trip.fetch().done(() => {
      let showHTML = showTemplate(trip.attributes);
      singleTripElement.append($(showHTML));
    });
  },

  addTrip(event) {
    event.preventDefault();

    const tripData = {};
    fields.forEach((field) => {
      const val = $(`input[name=${field}]`).val();
        if (val != '') {
          tripData[field] = val;
        }
    });

    console.log("THIS IS TRIP DATA");
    console.log(tripData);
    console.log('trip added');

    const trip = new Trip(tripData);
    if (trip.isValid()) {
      tripList.add(trip);
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
    });
    } else {
      $('#status-messages ul').append(`<li>Error ${trip.validationError['name'][0]}`);
      $('#status-messages').show();
    }
  },

  successfullSave(trip, response) {
  console.log('Success!');
  console.log(trip);
  console.log(response);
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
  $('#status-messages').show();
},
failedSave(trip, response) {
  console.log('Error!');
  console.log(trip);
  console.log(response);
  $('#status-messages ul').empty();
  console.log(response.responseJSON.errors);
  for(let key in response.responseJSON.errors) {
    response.responseJSON.errors[key].forEach((error) => {
      $('#status-messages ul').append(`<li>${key}: ${error}</li>`);
    })
  }
  $('#status-messages').show();
  trip.destroy();
},
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  showTemplate = _.template($('#show-template').html());
  tripList.fetch();

  $('#trips_button').click(events.allTrips);
  $('#add-trip-form').submit((event) => {
    event.preventDefault();
    console.log('arrow function triggered');
  });
  $('#add-trip-form').submit(events.addTrip);
  
  tripList.on('update', render, tripList);
  $('#trip-list').on('click', 'tr', function() {
    const tripID = $(this).attr('trip-id');
    events.loadTrip(tripID);
  });
});
