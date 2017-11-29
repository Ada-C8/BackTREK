// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip'
import TripList from './app/collections/trip_list'


console.log('it loaded!');

const newTrip = new Trip({
  name: "Here to There",
  continent: "Here",
  category: "There",
  duration: "4",
  cost: "45",
})

console.log(newTrip.get('name'));
console.log(newTrip.get('cost'));

let tripTemplate;

const tripList = new TripList();

// render html for tripList
const render = function render(tripList) {
  //iterate through the tripList, generate HTML
  //for each model and attach it to the DOM
  const tripTableElement = $('#trip-list');
  //tripTableElement.html('')
  //will clear out previous list when you render again
  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    console.log(trip.attributes);
    tripTableElement.append(generatedHTML);
  })
  $('#trip-table').show();

  $('.trip').on('click', function(event) {
    $(this).attr('data-id');
    console.log($(this).attr('data-id'));
  });
};


$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', render);

  $('#all-trips').on('click', function() {
    console.log('#all-trip has been clicked, in event handler');
    tripList.fetch();
    console.log('#all-trip has been clicked, in event handler, after fetch()');
  });

});
