// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

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

const events = {
  // Display Details of Trip
  displayDetails() {
    const id = $(this)[0].id;
    const trip = tripList.get(id);
    $('#list-wrapper').addClass('large-5');
    $('#reservation-form').show();
    $('#details').css('padding', '20px');
    trip.fetch().done(() => {
      $('#details').html(tripTemplate(trip));
    });
    $('#reservation-form').children('form').attr('id', id);
    $('#price').html(`$${trip.attributes.cost.toFixed(2)} - Reserve!`);
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
});

// $(document).ready(() => {
//
//   // FORM
//   $('form').submit(function fx(e) {
//     e.preventDefault();
//     postReservation($(this));
//   });
// });
