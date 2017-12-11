// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import Reservation from './app/models/reservation';
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
  trip.fetch({success: events.getTrip});
}

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${message}</li>`);
  $('#status-messages').show();
}

const rezFields = ['name', 'age', 'email'];
const events = {
  showTrips() {
    $('#trips-table').toggle({'display': 'block'});
  },
  getTrip(trip) {
  const $onetrip = $('.onetrip');
      $onetrip.empty();
      $onetrip.append(atripTemplate(trip.attributes));
  },
  makeReservation(event){
    event.preventDefault();
    const rezData = {};
    rezFields.forEach( (field) => {
      const val = $(`#rezform input[name=${field}]`).val();
      if (val != '') {
        rezData[field] = val;
      }
    });
    const reservation = new Reservation(rezData);

    if (reservation.isValid()) {
      const tripID = $(this).data('id');
      reservation.urlRoot = `${(new Trip()).urlRoot}${tripID}/reservations`;
      reservation.save({}, {
        success: events.successfullSave,
        error: events.failedSave,
      });
    } else {
      // getting here means there were client-side validation errors reported
      // console.log("What's on book in an invalid book?");
      // console.log(book);
      updateStatusMessageWith('reservation is invalid');
    }
  },
  successfullSave(reservation, response) {
    $('#rezform.input').val('');
    updateStatusMessageWith('reservation added!')
  },
  failedSave(reservation, response) {
    updateStatusMessageWith('reservation failed!');
    reservation.destroy();
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

  $(document).on('submit', '#rezform', events.makeReservation);
  // $('main').html('<h1>Hello World!</h1>');
});
