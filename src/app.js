/* eslint-disable */
// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

let tripsTemplate ;
let headerTemplate;
let showTripTemplate;
let formTemplate;

const tripFields = ['id', 'name', 'continent', 'category','weeks','cost'];

const loadTrips = function loadTrips(trips) {
  $('#trip-list').empty();
  $('#trip-list-headers').empty();

  tripFields.forEach((field) => {
    $('#trip-list-headers').append(headerTemplate({header: field}))
  });

  trips.forEach((trip) => {
    $('#trip-list').append(tripsTemplate(trip.attributes));
  });
};

const loadTrip = function loadTrip(trip) {
  $('#tripDetails').empty();
  $('#tripDetails').append(showTripTemplate(trip.attributes));
};

$(document).ready( () => {
  tripsTemplate = _.template($('#trip-list-template').html());
  headerTemplate = _.template($('#trip-headers-template').html());
  showTripTemplate = _.template($('#trip-details-template').html());

  const tripList = new TripList();
  tripList.on('update', loadTrips);
  tripList.fetch();

  $('#trip-list').on('click', '.trip', function(event){
    let tripId = $(this).data("id");
    const trip = new Trip({id: tripId});
    trip.on('change', loadTrip);
    trip.fetch();
  });

  $('#add-trip-form').submit(function(event) {
    event.preventDefault();

    const tripData = {};
    const fields = ['name', 'continent', 'category','weeks','cost'];

    fields.forEach(function(field){
      tripData[field] = $(`input[name=${field}]`).val();
    });

    const trip = new Trip(tripData);
    trip.save({}, {
      success: (model, response) => {
        tripList.add(model);
        $('#messages').html("Success")
      },
      error: (model, response) => {

      }
    });
  });

  $('#tripDetails').on('submit', "#reserve-trip-form", function(event) {
    event.preventDefault();

    let tripId = $(this).data("id");

    const reservationData = {};
    const reservationFields = ['name', 'email', 'age'];

    reservationFields.forEach(function(field){
      reservationData[field] = $(`#reserve-trip-form input[name=${field}]`).val();
    });

    reservationData['trip_id'] = tripId;

    let reservation = new Reservation(reservationData);

    reservation.save({}, {
      success: (model, response) => {
        $('#messages').html("Reserved!");
      },
      error: (model, response) => {
        $('#messages').html("Unable to reserve.");
      }
    });
  });

});
