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

// const allTrips = function allTrips(tripList) {
//   const tripListElement = $('#trip-list');
//   tripListElement.empty();
//
//   tripList.forEach((trip) => {
//     console.log(`Rendering trip ${trip.get('name')}`);
//     let tripHTML = tripTemplate(trip.attributes);
//     tripListElement.append($(tripHTML));
//   });
// };

// const loadTrip = function loadTrip(id) {
//   $.get(`https://ada-backtrek-api.herokuapp.com/trips/${id}`,
//     (response) => {
//       const tripInfo =
//         `<div>
//           <p> Trip name: ${response.name}</p>
//           <p> Category: ${response.category}</p>
//           <p> Continent: ${response.continent}</p>
//           <p> Description: ${response.about}</p>
//           <p> Duration: ${response.weeks} weeks</p>
//           <p> Cost: ${response.cost}</p>
//         </div>`;
//       }
//     )
// };

const events = {

  allTrips(event) {
    const tripListElement = $('#trip-list');
    tripListElement.empty();
    $('h2').text('Trip Options');
    $('#load_trips').show();
    tripList.forEach((trip) => {
      console.log(`Rendering trip ${trip.get('name')}`);
      let tripHTML = tripTemplate(trip.attributes);
      tripListElement.append($(tripHTML));
    });
  }
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  $('#trips_button').click(events.allTrips);
});
