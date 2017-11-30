// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

// Initialize
const tripList = new TripList();
const tripListTemplate = _.template($('#trip-list-template').html());
const tripTemplate = _.template($('#trip-template').html());

const render = function render(list) {
  const $list = $('#trip-list');
  // $list.empty();
  list.forEach((trip) => {
    $list.append(tripListTemplate(trip.toJSON()));
  });
}

const fields = ['name', 'continent', 'category', 'weeks', 'cost', 'about'];
const reservationFields = ['name', 'email', 'age'];

const events = {
  showTrips() {
    console.log('SHOW ME TRIPS!');
    $('button#show-trips').hide();
    $('#trip-table').show();
  },
  showTrip(event) {
    $('#reservation').show();
    const trip = new Trip({id: event.target.parentElement.id});
    trip.fetch({}).done(() => {
      $('#show-trip').html(tripTemplate(trip.attributes));
      console.log('YAY');
      $('form').attr('action', `${trip.url()}/reservations`);
    }).fail(() => {
      $('#show-trip').html('<p>Looks like that trip left without you...</p>');
      console.log('OOPS');
    });
  },
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => {
      $(`label[for=${field}] span`).remove();
      $(`input[name=${field}]`).removeClass('error');
      tripData[field] = $(`#add-trip-form [name=${field}]`).val();
    });
    const trip = new Trip(tripData);
    if (trip.isValid()) {
      // tripList.add(trip);
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
    } else {
      Object.entries(trip.validationError).forEach((error) => {
          $(`label[for=${error[0]}] span`).remove();
          $(`label[for=${error[0]}]`).append(`<span class="error">: ${error[1]}</span>`);
          $(`input[name=${error[0]}]`).addClass('error');
      });
    }
  },
  successfulSave(trip) {
    $('.modal').css('display','none');
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>You added ${trip.get('name')}!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    $('#status-messages ul').empty();
    Object.entries(response.responseJSON.errors).forEach((error) => {
      for(let i = 0; i < error[1].length; i++) {
        $('#status-messages ul').append(`<li>${error[0]}: ${error[1][i]}</li>`);
      }
    });
    $('#status-messages').show();
    trip.destroy();
  },
  addReservation(event) {
    event.preventDefault();
    const reservationData = {};
    reservationFields.forEach((field) => {
      $(`label[for=${field}] span`).remove();
      $(`input[name=${field}]`).removeClass('error');
      reservationData[field] = $(`#reservation-form input[name=${field}]`).val();
    });
    const r = new Reservation(reservationData);
    if (r.isValid()) {
      // tripList.add(trip);
      r.save({}, {
        url: $('form').attr('action'),
        success: events.successfulBook,
        error: events.failedBook,
      });
    } else {
      Object.entries(r.validationError).forEach((error) => {
          $(`label[for=${error[0]}] span`).remove();
          $(`label[for=${error[0]}]`).append(`<span class="error">: ${error[1]}</span>`);
          $(`input[name=${error[0]}]`).addClass('error');
      });
    }
  },
  successfulBook() {
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>Your reservation has been saved!</li>`);
    $('#status-messages').show();
  },
  failedBook(reservation, response) {
    $('#status-messages ul').empty();
    Object.entries(response.responseJSON.errors).forEach((error) => {
        $('#status-messages ul').append(`<li>${error[0]}: ${error[1]}</li>`);
    });
    $('#status-messages').show();
    reservation.destroy();
  },
}

console.log('it loaded!');

// -------------------------------------------------------
// Get the modal
let $modal = $('.modal');

$('#add-trip').on('click', function() {
  $('.modal').css('display', 'block');
});

// When the user clicks on <span> (x), close the modal
$('.close').on('click', function() {
  $('.modal').css('display: none');
});

// When the user clicks anywhere outside of the modal, close it
$(window).on('click', function(event) {
  if (event.target.id == 'myModal') {
    $('.modal').css('display','none');
  }
});
// -------------------------------------------------------


$(document).ready( function() {

  // On Start
  tripList.fetch();
  //   {}, {
  //   error: () => {
  //     $('#trip-table').html('<p>All the trips are on vacation</p>')
  //   }
  // });
  $('#sorting').hide();
  $('#trip-table').hide();
  $('#reservation').hide();

  // Event Trigger
  tripList.on('update', render, tripList);
  $('#add-trip-form').submit(events.addTrip);
  $('#reservation-form').submit(events.addReservation);

  // Event Handler
  $('button#show-trips').click(events.showTrips);
  $('#trip-list').click('tr', events.showTrip);
});
