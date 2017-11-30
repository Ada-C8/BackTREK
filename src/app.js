// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';


import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
console.log(tripList);

let tripTemplate;
let showTemplate;

const reservationFields = ['name', 'age', 'email'];

const events = {
  allTrips(event) {
    const $tripList = $('#trip-list');
    $tripList.empty();
    $('#all_trips_section').toggle();
    event.preventDefault();
    tripList.forEach((trip) => {
      $tripList.append(tripTemplate(trip.attributes));
    });
  },
  showTrip(id) {
    const $showTrip = $('#show_trip');
    $showTrip.empty();
    const trip = new Trip({id: id});
    const resForm = `<h2>Reserve Your Spot</h2>
    <form id="reserve-trip-form" action="https://trektravel.herokuapp.com/trips/${id}/reservations" method="post">
    <label for="name">Name</label>
    <input type="text" name="name"></input>

    <label for="age">Age</label>
    <input type="number" name="age"></input>

    <label for="email">Email</label>
    <input type="text" name="email"></input>

    <input id="submitResButton" type="submit" value="Reserve it!" class="button"></input>
    </form>`

    trip.fetch({}).done(() => {
      $showTrip.append(showTemplate(trip.attributes));
      $showTrip.append(resForm);
     });

  },
  // makeReservation(event) {
  //   event.preventDefault();
  //   const reservationInfo = {};
  //   reservationFields.forEach( (field) => {
  //     const val = $(`input[name=${field}]`).val();
  //       if (val !== '') {
  //         reservationInfo[field] = val;
  //       }
  //   });
  //   console.log('Reservation Added!');
  //
  //
  // },
  finalizeReservation(event) {
    event.preventDefault();
    const url = $(this).attr('action'); // Retrieve the action from the form
    const formData = $(this).serialize();
    // $(this).hide();
    $.post(url, formData, function(response) {
      $('#message').html('<p> Trip Reserved! </p>');
    }).fail(() => {
      $('#message').html('<p>Reserving Trip Failed</p>');
    });
  },
};

$('#all_trips_section').hide();


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  showTemplate = _.template($('#show-template').html());

  tripList.fetch();

  $('#trips_button').click(events.allTrips);

  $('#all_trips_section').on('click', 'tr', function() {
    $('.current-select-row').removeClass('current-select-row');
    const tripID = $(this).attr('data-id');
    console.log(this);
    $(this).addClass('current-select-row');
    events.showTrip(tripID);
  });



  // const finalizeReservation = function finalizeReservation() {
  //   $('#submitResButton').on('submit', 'form', function(e) {
  //     console.log("IN FINALIZERESERVATION FUNCTION");
  //     e.preventDefault();
  //     const url = $(this).attr('action'); // Retrieve the action from the form
  //     const formData = $(this).serialize();
  //     $(this).hide();
  //     $.post(url, formData, function(response) {
  //       $('#message').html('<p> Trip Reserved! </p>');
  //     }).fail(() => {
  //       $('#message').html('<p>Reserving Trip Failed</p>');
  //     });
  //   });
  // };

$('#show_trip').on('submit', 'form', events.finalizeReservation);

  // $('#reserve-trip-form').submit(events.finalizeReservation);

});
