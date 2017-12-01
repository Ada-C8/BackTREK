// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
import TripList from './app/collections/tripList';

// CSS
import './css/foundation.css';
import './css/style.css';

const TRIP_FIELDS = ['name', 'category', 'weeks', 'cost', 'about', 'continent']

let tripTemplate;

const loadTrips = function loadTrips(trips) {
  console.log('function working');
  console.log(trips);
  const tripTable = $('#tripSection');
  tripTable.html('');
  trips.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTable.append(generatedHTML);
  });
}

$(document).ready( () => {
  tripTemplate = _.template($('#tripTemplate').html());
  const singleTripTemplate = _.template($('#singleTripTemplate').html());
  const tripList = new TripList();
  tripList.fetch();



  $('#tripButton').on('click',() => {
    console.log('button works');
    tripList.forEach((trip) => {
      // const newTrip = new Trip(trip);
      const generatedHTML = tripTemplate(trip.attributes);
      $('#tripSection').append($(generatedHTML));
    });
  });

  $('#tripSection').on('click', 'tr', (e) => {
    console.log('single trip button worked');
    const baseURL = 'https://ada-backtrek-api.herokuapp.com/trips/'
    $.get(`${baseURL}${e.currentTarget.id}`, (response) => {
      console.log(response);
      const generatedHTML = singleTripTemplate(response);
      console.log(generatedHTML);
      $('#singleTrip').html(generatedHTML);
    });
  });

  tripList.on('sort', loadTrips);
  tripList.on('update', loadTrips)

  $('#createTripForm').on('submit', () => {
    console.log('Submission started');
    const url = 'https://ada-backtrek-api.herokuapp.com/trips';
    const name = $('#nameField')[0].value;
    const continent = $('#continentField')[0].value;
    const about = $('#aboutField')[0].value;
    const category = $('#categoryField')[0].value;
    const weeks = parseInt($('#weeksField')[0].value);
    const cost = parseFloat($('#costField')[0].value);
    const data = `name=${name}&continent=${continent}&about=${about}&category=${category}&weeks=${weeks}&cost=${cost}`
    const form = $('#createTripForm').serialize();

    $.post(url, data, (response) => {
      console.log('POST worked');
      console.log(response);
    }).fail(() => {

      console.log('The post call failed');
    });
    return false;
  });

  $('#reservationForm').on('submit', () => {
    console.log('Submission started');
    const id = $('#singleTrip li')[0].id;

    const url = `https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations`
    const data = $('#reservationForm').serialize();
    console.log('the data is');

    $.post(url, data, (response) => {
      console.log('POST worked');
      console.log(response);

    }).fail(() => {
      console.log('The post call failed');
    });
    return false;
  });

  TRIP_FIELDS.forEach((field) => {
    const header = $(`.sort.${field}`);
    header.on('click', () => {
      console.log(`sorting by ${field}`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

});
