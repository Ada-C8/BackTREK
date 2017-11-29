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
    const generatedHTML = tripTemplate(trip.attributes);
    // $('#book-list').append($(bookHTML));
    // jquery search has to look through the whole document
    // it will be faster (esp. with a lot of books) to do
    tripTableElement.append(generatedHTML);
  });

  // provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ trips.comparator }`).addClass('current-sort-field');
};



$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html());

  trips.on('update', render)
  trips.on('sort', render);

  trips.fetch();


  // $('main').html('<h1>Hello World!</h1>');
});
