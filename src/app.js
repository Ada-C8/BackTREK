// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from 'app/collections/trip_list';
import Trip from 'app/models/trip'

// const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();
const adventure = new Trip();
console.log(`trip trip ${adventure}`);

let listTemplate;

const renderTrips = function render(list) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  console.log(`tripList :${list}`);
  list.forEach((trip) => {
    const generatedHTML = listTemplate(trip.attributes);
    // console.log(trip.toString());
    tripTableElement.append(generatedHTML);
  });
};

let tripTemplate;

const renderTrip = function renderTrip(trip) {
  const tripElement = $('#trip');
  // clears html in tripElement
  tripElement.html('');
  const generatedHTML = tripTemplate(
    {name: "name",
    continent: "continent",
    weeks: "weeks",
    cost: "cost",
    category: "name",
});
  tripElement.append(generatedHTML);
}


$(document).ready( () => {
  // compile underscore list-template
  listTemplate = _.template($('#list-template').html());

  tripTemplate = _.template($('#trip-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);

  // tripList.on('update', render, tripList);

  tripList.fetch({
    success: function(list, resp) {
      // console.log('worked');
      // console.log(list);

    },
    error: function() {
      console.log('error');
    }
  });

  console.log(`log trip url : ${trip.url}`);
   // call .fetch on an instance of a trip
   // passing the trip into click event function closure thing

  $('#trips').on('click', (event) => {
    renderTrips(tripList);

    $('#trip-name').on('click', (event) => {
      // grab backbone object and pass into function
      renderTrip(adventure);
    })

  });

  // $('td').on('click', 'th', function (){
  //   console.log(`clicked! the trip name`);
  // })

});
