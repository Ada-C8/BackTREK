// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';

//MODELS AND COLLECTIONS
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

const $tripsList = $('#trips-list')
const $tripDescription = $('#trip-description')
const $newTripBtn = $('#newTripBtn');
const $addTripForm = $('#add-trip-form');
const $resFormBtn = $('#res-form-btn');
const $resForm = $('#reservation-form');
const $queryValue = $('#query-value');
const $statusMessages = $('#status-messages')
const $sort = $('.sort');
const $resModal = $('#res-modal');

//templates
let tripTemplate;
let tripDetailsTemplate;

// create tripList collection of trips
let tripList = new TripList();

// fields that exist for a trip in the Trek API
const fields = ['name', 'category', 'continent', 'weeks', 'cost', 'about', 'tripID'];

// render trips table
const render = function render(tripList) {
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  $tripsList.empty();
  tripList.forEach((trip) => {
    $tripsList.append(tripTemplate(trip.attributes));
  });
}

const renderErrors = (errors) => {
  $statusMessages.empty();
  Object.keys(errors).forEach((error) => {
    console.log(errors);
    $statusMessages.append(`<p>${errors[error]}</p>`);
  })
  $statusMessages.css('display', 'block');
}

const events = {
  showNewTripForm() {
    $('#new-trip-modal').css('display', 'block');
  },
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
      trip.save({}, {
        success: events.successfullSave,
        error: events.failedSave,
      });
    } else {
      renderErrors(trip.validationError);
    }
  },
  successfullSave(trip) {
    $statusMessages.empty();
    $statusMessages.append(`<p>${trip.get('name')} added!</p>`);
    $statusMessages.css('display', 'block');
  },
  failedSave(trip, response) {
    renderErrors(response.responseJSON.errors);

    // for (let key in response.responseJSON.errors) {
    //   response.responseJSON.errors[key].forEach((error) => {
    //     $('#status-messages').append(`<p>${key}: ${error}</p>`)
    //   });
    // }
    // $statusMessages.css('display', 'block');
    // $('#status-messages').show();
    trip.destroy();
  },
  successReservation(reservation, response) {
    $statusMessages.empty();
    $statusMessages.append(`<p>${reservation.get('name')} added!</p>`);
    $statusMessages.css('display', 'block');
    // $('#status-messages').show();
  },
  failedReservation(reservation, response) {
    renderErrors(response.responseJSON.errors)
    reservation.destroy();
  },
  sortTrips(event) {
    console.log(event);
    console.log('begin sorting!');
    $('.current-sort-field').removeClass('current-sort-field');

    // get the class list of the selected element
    const classes = $(this).attr('class').split(/\s+/);

    classes.forEach((className) => {
      if (fields.includes(className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        } else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });

    $('.current-sort-field').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');
  },
  filterTrips(event) {

    event.preventDefault();

    const $tripQuery = $('#trip-query option:selected');
    const query = $tripQuery.val();

    const $queryValue = $('#query-value');
    const queryValue = $queryValue.val();
    let filteredTrips = tripList;

    if (query == 'weeks' || query == 'cost') {
      filteredTrips = tripList.filter(trip => trip.get(query) <= queryValue);
    } else {
      filteredTrips = tripList.filter(function(trip) {
        const attr_value = trip.attributes[query].toLowerCase();
        const search_term = queryValue.toLowerCase();

        if (attr_value.includes(search_term)) {
          return true;
        }
      });
    }

    console.log(filteredTrips);
    render(filteredTrips);
  },
  clearModals() {
    const modal = document.getElementById('res-modal');
    const modal2 = document.getElementById('new-trip-modal');
    const modal3 = document.getElementById('status-messages-modal');

    if (event.target == modal || event.target == modal2 || event.target == modal3) {
      (event.target).style.display = 'none';
      modal3.style.display = 'none';
    }
  },
  getTrip() {
    const trip = new Trip({ id: $(this).attr('data-id') })
    $tripDescription.empty();
    trip.fetch().done(() => {
      $tripDescription.append(tripDetailsTemplate(trip.attributes));
    });
  },
  showResForm() {
    const tripID = $(this).attr('data-id');
    $resForm.append(`<input type="hidden" name="res-tripID" value="${tripID}">`);
    $resModal.css('display', 'block');
  },
  addReservation() {
    const resData = {};
    event.preventDefault();

    const formfields = ['name', 'age', 'email', 'tripID']
    event.preventDefault();

    formfields.forEach( (field) => {
      const val = $(`form input[name=res-${field}]`).val();
      if (val !== '') {
        resData[field] = val;
      }
    });

    const reservation = new Reservation(resData)


    if (reservation.isValid()) {
      reservation.save({}, {
        success: events.successReservation,
        error: events.failedReservation,
      });
    } else {
      Object.keys(reservation.validationError).forEach((error) => {
        $('#status-messages').append(`<p>${error}: ${reservation.validationError[error]}<p>}`)
      });
      $('#status-messages').css('display', 'block');
    }
  }
}

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());

  // Clicking Events
  $sort.click(events.sortTrips);
  $(document).on('click', events.clearModals);
  $tripsList.on('click', 'tr', events.getTrip);
  $tripDescription.on('click', 'button', events.showResForm);
  $newTripBtn.on('click', events.showNewTripForm)

  // Form Submitting Events
  $addTripForm.submit(events.addTrip);
  $resForm.submit(events.addReservation);




  // $resForm.submit( function submit(event) {
  //   const resData = {};
  //   event.preventDefault();
  //
  //   const formfields = ['name', 'age', 'email', 'tripID']
  //   event.preventDefault();
  //
  //   formfields.forEach( (field) => {
  //     const val = $(`form input[name=res-${field}]`).val();
  //     if (val !== '') {
  //       resData[field] = val;
  //     }
  //   });
  //
  //   const reservation = new Reservation(resData)
  //
  //
  //   if (reservation.isValid()) {
  //     reservation.save({}, {
  //       success: events.successReservation,
  //       error: events.failedReservation,
  //     });
  //   } else {
  //     Object.keys(reservation.validationError).forEach((error) => {
  //       $('#status-messages').append(`<p>${error}: ${reservation.validationError[error]}<p>}`)
  //     });
  //     $('#status-messages').css('display', 'block');
  //   }
  // });

  $queryValue.on('keyup', events.filterTrips);

  // Backbone Events
  tripList.on('update', render, tripList);
  tripList.on('sort', render, tripList);

  // Implement when page loads
  tripList.fetch()
});
