// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

import Trip from './app/models/trip'

import TripList from './app/collections/trip_list';


const TRIP_FIELDS = ['name', 'about', 'continent', 'category', 'weeks', 'cost'];

const trips = new TripList();

let tripTemplate;

let showTripTemplate;




const render = function render(trips) {

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  trips.forEach((trip) => {
    // console.log(trip)
    const generatedHTML = tripTemplate(trip.attributes);

    tripTableElement.append(generatedHTML);
    // console.log(trip.attributes.id);

    // $('#trip-list ').attr('trip-id').val(`${trip.attributes.id}`);
    // console.log(`${trip.attributes.id}`)
    // data-id=${trip.id}
  });

  // // provide visual feedback for sorting
  // $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ trips.comparator }`).addClass('current-sort-field');
};

const showTrip = function showTrip(id) {
  // console.log(parseInt(id));
  const singleTrip = $('#show-trip');

  // singleTrip.html('');

  const trip = trips.findWhere({id: parseInt(id)});
  // console.log(trip.url);
  // let result = trip.fetch();
  trip.fetch({
    success: (model, response) => {
      console.log('Successfully found trip!');
      // reportStatus('success', 'Successfully saved trip!');
      console.log(response);

      const generatedHTML = showTripTemplate(response);
      singleTrip.append(generatedHTML);


    },
  })
  // console.log(result);
  // // trips.fetch(trip.url)
  // const generatedHTML = showTripTemplate(result.responseJSON);
  //
  //
  //
  //
  // singleTrip.append(generatedHTML);

  // $('#show-trip').html(id);
  // $('#show-trip').show();
};

const readFormData = function readFormData() {
  const tripData = {};

  TRIP_FIELDS.forEach((field) => {


    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    // Don't take empty strings, so that Backbone can
    // // fill in default values
    // if (value != '') {
    //   bookData[field] = value;
    // }


    tripData[field] = value;
    // clears the field
    // break this out into a clear inputs and a method that reads inputs and one that does both
    // methods that don't have side effects
    // pure functions are guaranteed to be idempotent
    inputElement.val('');
  });

  return tripData;
};

const addTripHandler = function(event) {
  event.preventDefault();
  // const tripData = {};
  // console.log('in trip handler');
  //
  // TRIP_FIELDS.forEach((field) => {
  //
  //   const inputElement = $(`#add-trip-form input[name="${ field }"]`);
  //   const value = inputElement.val();
  //   tripData[field] = value;
  //   // clears the field
  //   inputElement.val('');
  // });


  console.log('read trip data');
  // console.log(readFormData());

  const trip = new Trip(readFormData());
  //const trip = trips.add(tripData);
  console.log(trip);
  // console.log(trip.url)


  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      trips.add(trip)
      // reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          // reportStatus('error', `${field}: ${problem}`);
        }
      }
    },
  });
};

$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());

  trips.on('update', render)
  // trips.on('sort', render);

  trips.fetch();
  // console.log(trips);

  $('#add-trip-form').on('submit', addTripHandler);


  $('#trip-list').on('click', 'tr td', function () {
    let tripId = $(this).attr('data-id');
    console.log(`this is the trip id ${$(this).attr('data-id')}`);
    // render();
    showTrip(tripId);
  });

  // $('#reserve-trip-form').on('submit', function () {
  //   let tripId = $(this).attr('data-id');
  //   console.log(`this is the trip id ${$(this).attr('data-id')}`);
  //   // render();
  //   showTrip(tripId);
  // });

  //   $('#trips table').on('click', 'tr .id', function () {
  //   let tripID = $(this).attr('data-id');
  //   console.log(`this is the trip id${$(this).attr('data-id')}`);
  //   loadTrip(tripID);
  // });


});
