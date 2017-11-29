// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// Initialize
const tripList = new TripList();
const tripListTemplate = _.template($('#trip-list-template').html());
// const tripTemplate = _.template($('#trip-template').html());

const render = function render(list) {
  const $list = $('#trip-list');
  // $list.empty();
  list.forEach((trip) => {
    $list.append(tripListTemplate(trip.toJSON()));
  });
}

const events = {
  showTrips() {
    console.log('SHOW ME TRIPS!');
    $('button#show-trips').hide();

    $('#trip-table').show();
  },
  showTrip(event) {
    console.log('MA TRIP!');
    const trip = new Trip({id: event.target.parentElement.id});
    const response = trip.fetch();
    console.log(tripListTemplate(response));

    $('show-trip').html();
  },
}

console.log('it loaded!');

// -------------------------------------------------------

$(document).ready( function() {
  // On Start
  tripList.fetch();
  $('#sorting').hide();
  $('#trip-table').hide();

  // Event Trigger
  tripList.on('update', render, tripList);

  // Event Handler
  $('button#show-trips').click(events.showTrips);
  $('#trip-list').click('tr', events.showTrip);
});
