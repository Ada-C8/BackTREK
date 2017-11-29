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

    // console.log(trip.attributes.id);

    // console.log(tripInfo.responseJSON);

  },
};

$('#all_trips_section').hide();


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  showTemplate = _.template($('#show-template').html());

  tripList.fetch();
  $('#trips_button').click(events.allTrips);
  $('#all_trips_section tr').click(events.showTrip);

  $('#all_trips_section').on('click', 'tr', function() {
    const tripID = $(this).attr('data-id');
    // console.log(tripID);
    events.showTrip(tripID);
  });
  // console.log(tripList);

});
