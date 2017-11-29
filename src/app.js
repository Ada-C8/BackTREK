// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Import Trip Model and Collection
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const rawTripData = [
  {
    name: "Kinkakuji",
    continent: "Asia",
    category: "historical",
    weeks: 1,
    cost: 100
  }
];

const tripList = new TripList(rawTripData);
let tripTemplate;

const render = function render(tripList) {
  let $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  console.log(tripList);
  render(tripList);
});
