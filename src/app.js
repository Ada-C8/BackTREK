// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

import Reservation from './app/models/reservation';
// import ReservationList from './app/collections/reservation_list';

console.log('it loaded!');

const tripList = new TripList();
// const reservationList = new ReservationList();

const fields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const reservationFields = ['name', 'email'];

let tripTemplate;
let detailTemplate;

console.log(tripList);

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    console.log(trip);
    // console.log(`Rendering trip ${trip.get('name')}`);

    // STILL A PROBLEM. SHOULD THIS BE HERE.
    // if (!trip.attributes.id) {
    //   const stringId = trip.cid;
    //   trip.attributes.id = parseInt(stringId);
    // }

    const tripHTML = tripTemplate(trip.attributes);
    tripListElement.append($(tripHTML));
  });
};

// =================================================================

const getIndividualTrip = function getIndividualTrip() {
  console.log('*****************');
  console.log(this);
  console.log('*****************');

  // const tripDetails = $('#trip-list');
  const id = $(this).attr('id');
  let trip = tripList.get(id);
  trip.fetch( {
    success: function(response) {
      console.log("I'm in success of the fetch");
      console.log(response);
      console.log("this is this");
      console.log(trip);

      let reservationForm = `<li><form id="form" action="https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations" method="post">

        <label for="name">Name</label>
        <input type="text" name="name"></input>

        <label for="email">Email</label>
        <input type="text" name="email"></input>

        <input type="submit" value="Reserve Spot" class="button reserve"></input>
      </form></li>`;

      $('#trip-details').empty();
      $('#trip-details').append(detailTemplate(details));
      $('#trip-details').append(reservationForm);
    },
    // success: ?,
    // error: ?
  });

  // console.log('*****************');
  // console.log("this is the trip");
  // console.log(trip);
  // console.log('*****************');

  let details = trip.attributes;

  // console.log("****************************");
  // console.log("these are the details");
  // console.log(details);
  // console.log("****************************");

};

// =================================================================

const events = {

  addReservation(event) {
    event.preventDefault();

    const url = $(this).attr('action');
    const formData = $(this).serialize();

    $.post(url, formData, () => {
      $('#form').html('<p> Reservation added! </p>');
    }).fail(() => {
      $('#form').html('<p> Adding Reservation failed! </p>');
    });
  },


  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    });

    console.log('trip added');
    console.log(tripData);

    const trip = new Trip(tripData);
    tripList.add(trip);
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave
    })
    this.reset();
  },

  successfulSave(trip, response) {
    console.log('success!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('ERROR');
    console.log(trip);
    console.log(response);

    $('#status-messages ul').empty();

    // console.log(response.responseJSON.errors);

    for(let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#status-messages ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#status-messages').show();
    trip.destroy();
  },

  sortTrips(event) {
    console.log(event); //this is so we can see what got clicked on
    console.log(this);
    //this is what we do to get the second word, the regex is for whitespace
    const classes = $(this).attr('class').split(/\s+/);

    // this allows us to sort the table based on the column and then sort back to the original.
    // looping through the classes ...
    classes.forEach((className) => {
      if (fields.includes (className)) {
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

  showAllTrips() {
    $('#trips-section').removeClass('hidden');
    $('#trips-section').addClass('show');
  },

  showAddTripForm() {
    $('#add-trip-form').removeClass('hidden');
    $('#add-trip-form').addClass('show');
  },
};


$(document).ready( () => {
  // $('main').html('<h1>backTrek!</h1>');
  tripTemplate = _.template($('#trip-template').html());
  detailTemplate = _.template($('#detail-template').html());

  tripList.on('update', render, tripList);

  tripList.fetch();

  $('#trips-table').on('click', 'tr', getIndividualTrip);

  $('#add-trip-form').submit(events.addTrip);
  $('.trip-info').click(events.showAllTrips);
  $('.trip-form').click(events.showAddTripForm);
  $('.sort').click(events.sortTrips);
  tripList.on('sort', render, tripList);

  $('body').on('submit', 'form', events.addReservation);

});
