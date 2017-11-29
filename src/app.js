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

console.log(tripList);

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    console.log(`Rendering trip ${ trip.get('name') }`);
    let tripHTML = tripTemplate(trip.attributes);
    tripListElement.append($(tripHTML));
  });
};

const fields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

const events = {
  addTrip(event) {
    event.preventDefault();
  //first thing need to do when someone adds a book is to get the values from the form
    const tripData = {};
    fields.forEach((field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    });

    console.log('trip added');
    console.log(tripData);

    const trip = new Trip(tripData);
    tripList.add(trip);
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave
    })
  },

  successfulSave(trip, response) {
    console.log('success!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('ERROR');
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
  }

};


$(document).ready( () => {
  // $('main').html('<h1>backTrek!</h1>');
  tripTemplate = _.template($('#trip-template').html());

  $('#add-trip-form').submit(events.addTrip);

  tripList.on('update', render, tripList);

  tripList.fetch();

});
