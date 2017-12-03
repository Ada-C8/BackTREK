// Make a point to write comments to understand code sections better, as well as, for reference.

// Vendor Modules.
import $ from 'jquery';
import _ from 'underscore';

// CSS.
import './css/foundation.css';
import './css/style.css';

// Models and collections.
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// DOM Selectors.
const $tripsList = $('#trips-list')
const $tripDescription = $('#trip-description')

// Templates for trip list and details.
let tripTemplate;
let tripDetailsTemplate;

// Start of trip list.
const tripList = new TripList();

const render = function render(tripList) {
  console.log(tripList);
  const $trips = $('#trips-list')

  // Remember to empty, so things don't repeat.
  $trips.empty();
  tripList.forEach((trip) => {
    $trips.append(tripTemplate(trip.attributes));
    console.log(trip.attributes);
    console.log('it loaded!');
  });
};



// User can create a new trip.

// User can reserve a spot on a trip. *Please note you will need to do validations with the second wave.

// Sort the list of the trips.

// Flash message to user that the list has been sorted, even if they can't see the actual sorting has happened.


$(document).ready( () => {

// Get those trip deets.
  $tripsList.on('click', 'tr', function getTrip() {
    const trip = new Trip({ id: $(this).attr('data-id') })
    $tripDescription.empty();

    trip.fetch().done(() => {
      $tripDescription.append(tripDetailsTemplate(trip.attributes));
    });
  });


  tripTemplate = _.template($('#trip-template').html());
  tripList.on('update', render, tripList);
  tripList.fetch();

  tripDetailsTemplate = _.template($('#trip-details-template').html());
});








// Notey notes from books and tutoring.

// Tutoring notes, breakdown of detail fetching.
// $tripsList.on('click', 'tr', function getTrip() {
//   const trip = new Trip({ id: $(this).attr('data-id') })
//   $tripDescription.empty();
//
//   trip.fetch().done(() => {
    // const element = $tripDescription;
    // const appendFunction = element.append.bind(element);
    // const attrs = trip.attributes;
    // const templateResult = tripDetailsTemplate(attrs);
    // const appendResult = appendFunction(templateResult);

    // $tripDescription.append(tripDetailsTemplate(trip.attributes));
  // });


// successfullSave(trip, response) {
//   console.log('Success!');
//   console.log(trip);
//   console.log(response);
//   $('#status-messages ul').empty();
//   $('#status-messages ul').append(`<li>${trip.get('title')} added to ze listy list list!</li>`);
//   $('#status-messages').show();
// },
// failedSave(trip, response) {
//   console.log('ERROR!');
//   console.log(trip);
//   console.log(response);
//   $('#status-messages ul').empty();
//   console.log(response.responseJSON.errors);
//   for(let key in response.responseJSON.errors) {
//     response.responseJSON.errors[key].forEach((error) => {
//       $('#status-messages ul').append(`<li>${key}: ${error}</li>`);
//     })
//   }
//   $('#status-messages').show();
//   trip.destroy();
// },
// };


// $(document).ready(() => {
//   tripTemplate = _.template($('#trip-template').html());
//   $('#add-trip-form').submit(events.addTrip);
//   $('.sort').click(events.sortTrips);
//   tripList.on('update', render, tripList);
//   tripList.on('sort', render, tripList);
//
//   tripList.fetch();
// });
