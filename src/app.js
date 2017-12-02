// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();

let tripTemplate;
let showTemplate;

const events = {
  allTrips(event) {
    const tripListElement = $('#trip-list');
    tripListElement.empty();
    $('h2').text('Trip Options');
    $('#load_trips').show();
    tripList.forEach((trip) => {
      let tripHTML = tripTemplate(trip.attributes);
      tripListElement.append($(tripHTML));
    });
  },

  loadTrip(id) {
    const singleTripElement = $('#single-trip');
    singleTripElement.empty();
    const trip = new Trip({id: id});
    console.log('THIS IS THE TRIP ID');
    console.log(trip);

    $('h3').text('Trip Info');

    console.log("ATTRIBUTES");
    console.log(trip.attributes);
    console.log('THIS IS THE TRIP');
    console.log(trip.attributes.name);
    trip.fetch().done(() => {
      let showHTML = showTemplate(trip.attributes);
      console.log(showHTML);
      singleTripElement.append($(showHTML));
    });
  },
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  showTemplate = _.template($('#show-template').html());

  tripList.fetch();

  $('#trips_button').click(events.allTrips);

  $('#trip-list').on('click', 'tr', function() {
    const tripID = $(this).attr('trip-id');
    events.loadTrip(tripID);
  });
});
