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
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => { //get values from form
      const val = $(`input[name=${field}]`).val();
      if (val != '') {
        tripData[field] = val;
      }
      console.log(`field: ${field}, value: ${val}`);
    });
    const trip = new Trip(tripData);
    console.log(tripData);
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave,
    });
    tripList.fetch();
  },
  successfulSave(trip, response) {
    $('#modal-message ul').empty();
    $('#modal-message ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#modal-message').addClass('success').show();
    // $.modal.close();
    $("#new-trip-form").modal({
 escapeClose: true,
 clickClose: true,
 showClose: true
});
  },
  failedSave(trip, response) {
    $('#modal-message ul').empty();
    console.log(response);
    console.log(trip);
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

});

// $(document).ready(() => {
//
//   // FORM
//   $('form').submit(function fx(e) {
//     e.preventDefault();
//     postReservation($(this));
//   });
// });
