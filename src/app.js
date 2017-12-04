// Vendor Modules.
import $ from 'jquery';
import _ from 'underscore';

// CSS.
import './css/foundation.css';
import './css/style.css';

// Models and collections.
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
// import Reservation from './app/models/reservation';

// DOM Selectors.
const $tripsList = $('#trips-list')
const $tripDescription = $('#trip-description')
const $reservationTripForm = $('#reservation-trip-form')

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
    console.log('It loaded!');
  });
};

const fields = ['name', 'category', 'continent', 'weeks', 'cost', 'about'];

const reservationFields = ['name', 'email', 'id'];

const events = {
  // Add a bloody trip
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
      if (val != '') {
        tripData[field] = val;
      }
    });

    const trip = new Trip(tripData);

    if (trip.isValid()) {
      // tripList.add(trip);
      trip.save({}, {
        success: events.successfullSave,
        error: events.failedSave,
      });
    } else {
      console.log('Trip is invalid, sad trombone.');
      console.log(trip.validationError);

      // updateStatusMessageFrom(trip.validationError);
    }
  },

  successfullSave(trip, response) {
    console.log('Success!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('title')} added to ze listy list list!</li>`);
    $('#status-messages').show();
    tripList.fetch();
  },

  failedSave(trip, response) {
    console.log('ERROR!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    console.log(response.responseJSON.errors);

    for(let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#status-messages ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#status-messages').show();
    trip.destroy();
  },

  // Make a reservation

  addReservation(event){
    event.preventDefault();
    const reserveData = {};

    reservationFields.forEach((field) => {
      reserveData[field] = $(`input[name=${field}]` ,$reservationTripForm).val();
      });

    // reservationFields.forEach((field) =>{
    //   reserveData[field] = $(`input[name=${field}]`).val();
    // });

    console.log('Your reservation has been added!');
    console.log(reserveData);

    const reservation = new Reservation(reserveData);

    reservationList.add(reservation);
    reservation.save({
      success: events.successfulSave,
      error: events.failedSave
    })
    this.reset();
  },

  // Sort Trips
  sortTrips(event) {
    console.log(event);
    console.log(this);
  // Get the class list of the selected element
    const classes = $(this).attr('class').split(/\s+/);

    classes.forEach((className) => {
      if (fields.includes(className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        }
        else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });

    $('.sort-field').removeClass('sort-field');
    $(this).addClass('sort-field');
  },
};

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

  $('#add-trip-form').submit(events.addTrip);

  // $reservationTripForm.submit( function submit(event) {
  // const resData = {};
  // event.preventDefault();

  $('.sort').click(events.sortTrips);
  tripList.on('sort', render, tripList);
});
