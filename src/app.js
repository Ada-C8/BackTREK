// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

import TripList from './app/collections/trip_list';


const TRIP_FIELDS = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const trips = new TripList();

let tripTemplate;


const render = function render(trips) {

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  trips.forEach((trip) => {
    console.log(trip)
    const generatedHTML = tripTemplate(trip.attributes);
    // $('#book-list').append($(bookHTML));
    // jquery search has to look through the whole document
    // it will be faster (esp. with a lot of books) to do
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
  const trip = trips.findWhere({id: parseInt(id)});
  console.log(trip);

  // $('#show-trip').html(id);
  // $('#show-trip').show();
};


$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html());

  trips.on('update', render)
  trips.on('sort', render);

  trips.fetch();
  // console.log(trips);

  $('#trip-list').on('click', 'tr td', function () {
    let tripId = $(this).attr('data-id');
    console.log(`this is the trip id ${$(this).attr('data-id')}`);
    // render();
    showTrip(tripId);
  });

  //   $('#trips table').on('click', 'tr .id', function () {
  //   let tripID = $(this).attr('data-id');
  //   console.log(`this is the trip id${$(this).attr('data-id')}`);
  //   loadTrip(tripID);
  // });


});
