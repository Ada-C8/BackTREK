// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';

// Backbone Models
import Trip from './app/models/trip';

// Backbone Collections
import TripList from './app/collections/trip_list';

const tripList = new TripList();

let tripTemplate;
let tripListTemplate;

const render = function render(list) {
  $('#trip-list').empty();
  list.forEach((trip) => {
    $('#trip-list').append(tripListTemplate(trip.attributes));
    $(`#${trip.attributes.id} td.category`).html(trip.capitalize(trip.attributes.category));
    $(`#${trip.attributes.id} td.cost`).html(trip.attributes.cost.toFixed(2));
  });
};

// API Fields
const fields = ['name', 'category', 'continent', 'weeks', 'about', 'cost'];

const events = {
  // Display Details of Trip
  displayDetails() {
    const id = $(this)[0].id;
    const trip = new Trip({id: id});
    $('#list-wrapper').addClass('large-5');
    $('#reservation-form').show();
    $('#details').css('padding', '20px');
    trip.fetch({}).done(() => {
      $('#details').html(tripTemplate(trip));
      $('#price').html(`$${trip.attributes.cost.toFixed(2)} - Reserve!`);
    });
    $('#reservation-form').children('form').attr('id', id);
  },
  // Make a Reservation
  postReservation(response) {
    const formData = response;
    const url = `https://ada-backtrek-api.herokuapp.com/trips/${response[0].id}/reservations`;
    $.post(url, formData.serialize(), (data) => {
      $('#form-submit').children('section').addClass('success');
      $('#price').html(`${data.name} is booked!`);
    })
    .fail(() => {
      $('#message').addClass('failure').html('Uhh... Something happened. Please try again.');
    });
    // TODO: Clear form and make it so it doesn't repetitively book.
},
  // Add a New Trip
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => { //get values from form
      const val = $(`input[name=${field}]`).val();
      if (val != '') {
        tripData[field] = val;
      }
    });
    const trip = new Trip(tripData);
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave,
    });
    tripList.fetch();
  },
  successfulSave(trip) {
    $('#modal-message ul').empty();
    $('#modal-message ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#modal-message').addClass('success').show();
    $("#new-trip-form").modal({
      escapeClose: true,
      clickClose: true,
      showClose: true
    });
  },
  failedSave(trip, response) {
    $('#modal-message ul').empty();
    for (let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#modal-message ul').append(`<li>${key}: ${error}</li>`);
      });
    }
    $('#modal-message').addClass('failure').show();
    trip.destroy();
  }
}

$(document).ready( () => {
  // PREP
  $('#reservation-form').hide();
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-detail-template').html());

  // BASICS
  $('#get-list').click(() => {
    $('.home').removeClass('home');
    $('#list').removeClass('hide');
  });

  $('#list').on('click', 'tr', events.displayDetails);
  tripList.on('update', render, tripList);
  tripList.fetch();

  //NEW Trip
  $('#new-trip-form').submit(events.addTrip);

  // FORM
  $('#reservation-form').children('form').submit(function fx(e) {
    e.preventDefault();
    events.postReservation($(this));
  });
});
