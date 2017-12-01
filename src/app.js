// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from 'app/collections/trip_list';

// const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();

// initalize templates
let listTemplate;
let tripTemplate;

const renderTrips = function renderTrips(list) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  console.log(`tripList :${list}`);
  list.forEach((trip) => {
    const generatedHTML = $(listTemplate(trip.attributes));
    // adding event handler here gives context as to which trip needs to be clicked
    generatedHTML.on('click', (event) => {
      // grab backbone object and pass into function
      renderTrip(trip);
    })
    tripTableElement.append(generatedHTML);
  });
};

const renderTrip = function renderTrip(trip) {
  console.log(`trip: ${trip}`);
  const tripElement = $('#trip');
  // clears html in tripElement
  tripElement.html('');
  const generatedHTML = tripTemplate(trip.attributes);
  tripElement.append(generatedHTML);
}

$(document).ready( () => {
  // compile underscore templates
  listTemplate = _.template($('#list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  tripList.fetch();

  // tripList.fetch({
  //   success: function(list, resp) {
  //     // console.log('worked');
  //     // console.log(list);
  //
  //   },
  //   error: function() {
  //     console.log('error');
  //   }
  // });

  $('#trips').on('click', (event) => {
    renderTrips(tripList);
  }); // end tripsList event handler

}); // end doc.ready
