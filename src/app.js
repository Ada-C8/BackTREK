// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// OUR COMPONENTS
import TripList from './collections/trip_list';

// TRIP FIELDS
const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();

// Starts undefined - we'll set this in $(document).ready
// once we know the template is available
let tripTemplate;

const render = function render(tripList) {
  // iterate through the tripList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

///////////////////////////
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
});
