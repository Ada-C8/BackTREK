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
let atripTemplate;
let trip;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

const seeTrip = function seeTrip(id){
  trip = tripList.get(id);
  console.log(trip)
  trip.fetch({success: events.getTrip});
}



const events = {
  showTrips() {
    $('#trips-table').toggle({'display': 'block'});
  },
  getTrip(trip) {
  const $onetrip = $('.onetrip');
      $onetrip.empty();
      $onetrip.append(atripTemplate(trip.attributes));
  },

};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  atripTemplate = _.template($('#atrip-template').html());
  $('#load').on('click', function() {
      events.showTrips();
  });
  tripList.on('update', render, tripList);
  tripList.fetch();

  $('#trips-table').on('click', '.trip', function() {
    let tripID = $(this).attr('atrip-id');
    seeTrip(tripID);
  })
  // $('main').html('<h1>Hello World!</h1>');
});
