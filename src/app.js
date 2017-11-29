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

// // Display List of Trips
const displayList = function displayList() {
  $('.home').removeClass('home');
    $('#list').removeClass('hide');
  //   $.get(apiUrl, (response) => {
  //     let list = '<ul>';
  //     response.forEach((thing) => {
  //       list += `<li id="${thing.id}">${thing.name}</li>`;
  //     });
  //     list += '</ul>';
  //     $('#list').html(list);
  //   }).fail(() => {
  //     $('#message').addClass('failure').html('Oops! Something went wrong!');
  //   });
};

const render = function render(list) {
  $('#trip-list').empty();
  list.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
    // $('#trip-list').children('tr').attr('id', id);
  });
};

$(document).ready( () => {
  // PREP
  $('#reservation-form').hide();
  tripTemplate = _.template($('#trip-listing-template').html());

  // BASICS
  $('#get-list').click(displayList);
  tripList.on('update', render, tripList);
  tripList.fetch();
});

// $(document).ready(() => {
//
//   // BASICS
//   $('#list').on('click', 'li', function fx() {
//     $('#list-wrapper').addClass('large-5');
//     displayDetails($(this)[0].id);
//   });
//
//   // FORM
//   $('form').submit(function fx(e) {
//     e.preventDefault();
//     postReservation($(this));
//   });
// });
