// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
const trip = new Trip();

let tripListTemplate;
let tripTemplate;

const getTrip = function getTrip(tripId) {

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

const loadTrip = function loadTrip(trip) {
  console.log('clicked');
  const $tripDetail = $('#trip-detail');

  $tripDetail.empty();
  console.log(this);
  console.log(typeof this);
  // console.log(tripList);
  // $tripDetail.append(tripTemplate(this));
  // $tripDetail.append(tripTemplate(trip));
};

const events = {
  getTrip(event) {
    const tripId = event.currentTarget.id;
    const url = `${tripList.url}/${tripId}`;
    let trip = new Trip();
    $.get(url, (response) => {
      const $tripDetail = $('#trip-detail');

      $tripDetail.empty();
      $tripDetail.append(tripTemplate(response));
    }).fail(function() {
      console.log("failure");
    });


  }
};

$(document).ready( () => {
  // load templates
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', render, tripList);
  $('#trip-list').on('click', 'tr', events.getTrip, this);


  tripList.fetch();
});
