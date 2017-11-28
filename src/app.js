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



$(document).ready( () => {
  // PREP
  $('#reservation-form').hide();

  // BASICS
  // $('#get-list').click(displayList);
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

// // Display List of Trips
// const displayList = function displayList() {
//   $('.home').removeClass('home');
//   $('#list').removeClass('hide');
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
// };
