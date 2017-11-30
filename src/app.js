// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//MODELS AND COLLECTIONS
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

//selectors from the DOM
const $tripsList = $('#trips-list')
const $tripDescription = $('#trip-description')
const $newTripBtn = $('#newTripBtn');
const $addTripForm = $('#add-trip-form');

//templates
let tripTemplate;
let tripDetailsTemplate;

const tripList = new TripList();

// render trips table
const render = function render(tripList) {
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  $tripsList.empty();
  tripList.forEach((trip) => {
    $tripsList.append(tripTemplate(trip.attributes));
  });
}

// const newTrip = function newTrip() {
//   console.log('button clicked!');
// }
const fields = ['name', 'category', 'continent', 'weeks', 'cost', 'about'];

const events = {
  addTrip(event){
    event.preventDefault();
    const tripData = {};

    fields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
      if (val !== '' ) {
        tripData[field] = val;
      }
    });

    const trip = new Trip(tripData);

    if (trip.isValid()) {
      console.log('VALID!');
    } else {
      console.log('uh oh! Invalid trip :(')
    }
    // tripList.add(trip);
    // trip.save({}, {
    //   success: events.successfullSave,
    //   error: events.failedSave,
    // });
  },
  successfullSave(trip, response) {
    console.log('Success!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!<li>`)
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('errrrror!');
    console.log(trip);
    console.log(response);
    console.log(response.responseJSON.errors);

    for (let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#status-messages ul').append(`<li>${key}: ${error}</li>`)
      });
    }
    $('#status-messages').show();
    trip.destroy();
  },

}


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());


  // User Events
  $tripsList.on('click', 'tr', function getTrip() {
    const trip = new Trip({ id: $(this).attr('data-id') })

    trip.fetch().done(() => {
      $tripDescription.append(tripDetailsTemplate(trip.attributes));
    });
  });


  // $newTripBtn.on('click', newTrip);
  $addTripForm.submit(events.addTrip);

  // Data Events
  tripList.on('update', render, tripList);

  // Implement when page loads
  tripList.fetch();
});
