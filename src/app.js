// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// let modal = require('jquery-modal')($);

const tripList = new TripList();
const trip = new Trip();

let tripListTemplate;
let tripTemplate;

const addTripForm = function addTripForm() {

};

const render = function render(tripList) {
  // empty existing list
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripListTemplate(trip.attributes));
  });
  console.log(tripList);
};

const events = {
  getTrip(event) {
    const tripId = event.currentTarget.id;
    const url = `${tripList.url}/${tripId}`;

    // let trip = new Trip({id: tripId});

    let trip = new Trip({id: tripId});
    console.log(trip.fetch());
    trip.fetch({
      success: function(response) {
        console.log(response.attributes);

        const $tripDetail = $('#trip-detail');

        $tripDetail.empty();
        $tripDetail.append(tripTemplate(response.attributes));
      },
      // how is this handled???
      error: function(response) {
        console.log(response.attributes);
      }
    });
  },

  addTrip() {
    
  }

};

$(document).ready( () => {
  // load templates
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', render, tripList);
  $('#trip-list').on('click focus', 'tr', events.getTrip, this);

  // $('#add-trip').click(events.addTrip);


  tripList.fetch();
});
