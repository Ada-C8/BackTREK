// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// CLASSES
import TripList from 'app/collections/trip_list';
console.log('it loaded!');

// array of fileds for sorting
const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];
// create variable for using in document.ready
const tripList = new TripList();
// create variable and set it in doucment.ready
let tripTemplate;

const showTrips = function(tripList) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  // console.log(tripList);
  for (let trip of tripList.models) {
    const generatedHTML = tripTemplate(trip.attributes);
    // console.log(trip);
    tripTableElement.append(generatedHTML);
  }
}

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  // $('main').html('<h1>Hello World!</h1>');

  tripList.on('update', showTrips);
  tripList.on('sort', showTrips);

  tripList.fetch();








}); //end of ready
