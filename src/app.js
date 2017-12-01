// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list'
import Trip from './app/models/trip';

console.log('it loaded!');

const tripList = new TripList()
const trip = new Trip()

let tripsTemplate;
let tripDetailTemplate;


const render = function render(tripList) {
  const $tripsElement = $('#trip-list');
  $tripsElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    generatedHTML.on('click', (event) => {
      console.log('testing click');
      $('#trips').hide()
      $('#trip').show()
      // due to asynchonous api responses we put the renderTrip into the .fetch()
      trip.fetch({
        success(model, response) {
          renderTrip(model);
        }
      });

    })
    $tripsElement.append(generatedHTML)
  });
};

// const renderTripDetails = function renderTripDetails(trip) {
//
//   const tripDivElement = $('#trip-show');
//   tripDivElement.html('');
//   trip.fetch({
//     success: (model) => {
//       const detailsHTML = $(tripDescriptionTemplate(trip.attributes));
//       tripDivElement.append(detailsHTML);
//     }
//   });
const renderTrip = function renderTrip(trip) {
  const $tripElement = $('#trip');
  $tripElement.html('');
  console.log(trip.attributes);
  // console.log(trip.attributes.about);

  const generatedDetailHTML = tripDetailTemplate(trip.attributes);
  $tripElement.html(generatedDetailHTML)
}

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
};

// const loadTrip = function trip(id) {
  // trip.fetch();
//   trip.on('update', renderTrip, trip)
// }

console.log(tripList);

// Jquery event handling
$(document).ready( () => {
  tripsTemplate = _.template($('#trip-template').html());
  tripDetailTemplate = _.template($('#trip-detail-template').html());

  $('#trips').hide();

  console.log('loadtrips');
  console.log(loadTrips());

  $('#trip').on('click', 'tr', renderTrip);

  $('#load-trips').on('click', function (){
    $('#trips').show();
    loadTrips()
  });

  // $('#trip-list').on('click', 'tr',function (event) {
  //   event.preventDefault();
  //   let tripID = $(this).attr('data-id')
  //
  //   console.log(tripID);
  //   loadtrip(tripID);
  //   $('trip').show()
  //   $('trips').hide()
  // })


});
