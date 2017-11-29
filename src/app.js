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


// const render = function render(tripList) {
//
//   const $tripList = $('#trip-list');
//   $tripList.empty();
//   tripList.forEach((trip) => {
//     $tripList.append(tripTemplate(trip.attributes));
//   });
//
// };

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
    event.preventDefault();
    const trip = new Trip({id: id});
    trip.fetch({}).done(() => { $showTrip.append(showTemplate(trip.attributes)); });
  },
  makeReservation(event) {
    event.preventDefault();
    const reservationInfo = {};
    reservationFields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
        if (val !== '') {
          reservationInfo[field] = val;
        }
    });
    console.log('Reservation Added!');


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

});
