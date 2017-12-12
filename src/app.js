// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';
// import './responsive-tables'; TODO: Test again.

// CSS
import './css/foundation.css';
// import './css/responsive-tables.css'
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
      response[0].reset();
    })
    .fail(() => {
      $('#message').addClass('failure').html('Uhh... Something happened. Please try again.');
    });
  },
  // Add a New Trip
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => { //get values from form
      const val = $(`#new-trip-form input[name=${field}]`).val();
      if (val != '') {
        tripData[field] = val;
      }
    });
    const trip = new Trip(tripData);
    if (trip.isValid()) {
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
    } else {
      events.renderValidationFailure($('#modal-message ul'), trip.validationError);
    }
    tripList.fetch();
  },
  // Sort Trip table
  sortTrips() {
    const classes = $(this).attr('class').split(/\s+/);
    if (!classes.includes('alpha-sort') && !classes.includes('omega-sort')) {
      $('.alpha-sort').removeClass('alpha-sort');
      $('.omega-sort').removeClass('omega-sort');
    }
    classes.forEach((className) => {
      if (fields.includes(className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          $(this).toggleClass('alpha-sort omega-sort');
          tripList.trigger('sort', tripList);
        } else {
          tripList.comparator = className;
          $(this).addClass('alpha-sort');
          tripList.sort();
        }
      }
    });
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
    events.renderValidationFailure($('#modal-message ul'), response.responseJSON.errors);
    trip.destroy();
  },
  renderValidationFailure(jqObject, errorsHash) {
    jqObject.empty();
    jqObject.addClass('failure').show();
    for (let key in errorsHash) {
      errorsHash[key].forEach((error) => {
        jqObject.append(`<li>${key}: ${error}</li>`);
      });
    }
  }
}

$(document).ready( () => {
  // PREP
  $('#reservation-form').hide();
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-detail-template').html());

  // BASICS
  $('#get-list').click(() => {
    $('.home').removeClass('home')
    $('header section').removeClass('hide').addClass('medium-4');
    $('#list').removeClass('hide');
  });

  $('#trip-list').on('click', 'tr', events.displayDetails);

  tripList.on('update', render, tripList);
  tripList.on('sort', render, tripList);
  tripList.fetch();

  // Sort Table by fields
  $('.sort').click(events.sortTrips);

  // New Trip
  $('#new-trip-form').submit(events.addTrip);

  // New Reservation
  $('#reservation-form').children('form').submit(function fx(e) {
    e.preventDefault();
    events.postReservation($(this));
  });
});
