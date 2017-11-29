// Vendor Modules
// import ‘jquery-modal’
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();

const render = function(tripList) {
  const tripTemplate = _.template($('#trip-template').html());
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append($(tripTemplate(trip.attributes)).attr('id', `${trip.id}`));
  })
}

$(document).ready( () => {
  $('#bookingForm').hide();
  $('#all-trips').hide();
  tripList.on('update', render, tripList);
  tripList.fetch();
  $('#show-all').on('click', function(){
    $('#trip-description').empty();
    $('#all-trips').show();
  })

  $('#trip-list').on('click', 'tr', function(){
    $('#trip-description').empty();
    const tripTemplate = _.template($('#description-template').html());
    const trip = new Trip(this)
    trip.fetch({}, ).done(() => {$('#trip-description').html($(tripTemplate(trip.attributes)))})


    $('#bookingForm form').remove('action')
    $('#bookingForm form').attr('action', `https://trektravel.herokuapp.com/trips/${trip.id}/reservations`)
    $('#bookingForm').show();

  })
});
