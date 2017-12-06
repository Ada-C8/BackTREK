// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';


import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';


console.log('it loaded!');

const tripList = new TripList();

let tripTemplate;
let showTemplate;

let filteredList;

const reservationFields = ['person', 'age', 'email', 'trip_id'];
const newTripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost']

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

const renderFiltered = function(filteredList) {
  const $tripList = $('#trip-list');
  $tripList.empty();

  filteredList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

const updateStatusMessageFrom = (messageHash) => {
  $('#status-messages ul').empty();
  for(let messageType in messageHash) {
    messageHash[messageType].forEach((message) => {
      console.log(message);
      $('#status-messages ul').append($(`<li>${messageType}:  ${message}</li>`));
    })
  }
  $('#status-messages').show();
}

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`${message}</li>`);
  $('#status-messages').show();
}

const events = {
  allTrips(event) {
    const $tripList = $('#trip-list');
    $tripList.empty();
    $('#all_trips_section').toggle();
    event.preventDefault();
    tripList.forEach((trip) => {
      $tripList.append(tripTemplate(trip.attributes));
    });
  },
  showTrip(id) {
    const $showTrip = $('#show_trip');
    $showTrip.empty();
    $showTrip.show();
    const trip = new Trip({id: id});
    const resForm = `<h2>Reserve Your Spot</h2>
    <form id="reserve-trip-form" "action="https://trektravel.herokuapp.com/trips/${trip.id}/reservations" method="post">

    <label for="person">Name</label>
    <input type="text" name="person" placeholder="Enter Name"></input>

    <label for="age">Age</label>
    <input type="number" name="age" placeholder="Enter Age"></input>

    <label for="email">Email</label>
    <input type="text" name="email" placeholder="Enter Email"></input>

    <input type="hidden" value="${trip.id}" name="trip_id" />

    <input id="submitResButton" type="submit" value="Reserve it!" class="button"></input>
    </form>`
    trip.fetch({}).done(() => {
      $showTrip.append(resForm);
      $showTrip.append(showTemplate(trip.attributes));
    });

  },
  finalizeReservation(event) {
    event.preventDefault();
    const url = $(this).attr('action'); // Retrieve the action from the form
    const resData = {};
    reservationFields.forEach( (field) => {
      if (field === 'person') {
        const val = $(`input[name='person']`).val();
      }
      const val = $(`input[name=${field}]`).val();
      if (val !== '') {
        resData[field] = val;
      }
    });
    resData['name'] = $(`input[name='person']`).val();
    delete resData['person'];
    const res = new Reservation(resData);
    if (res.isValid()) {
      res.save({}, {
        success: events.succesfulResSave,
        error: events.failedResSave,
    });
  } else {
    // getting here means there were client-side validation errors reported
    $('#message').empty();
    let messageObj = res.validationError;
    for(let messageType in messageObj) {
      messageObj[messageType].forEach((message) => {
        $('#message').append($(`<p>${message}</p>`));
      })
    }
    $('#message').show();
    $('#message').addClass('errors');
    $('#message').delay(2000).hide(1);
    console.log("RESERVATION VALIDATION ERRORS!!")
  }
},
succesfulResSave() {
  $('#show_trip').hide();
  $('#message').show();
  $('#message').empty();
  $('#message').removeClass('errors');
  $('#message').html('<p> Trip Reserved! </p>');
  $('#message').delay(1000).hide(1);
},
failedResSave() {
  $('#message').empty();
  $('#message').html('<p>Reserving Trip Failed</p>');
  $('#message').delay(2000).hide(1);
},
addTrip(event) {
  event.preventDefault();
  const tripData = {};
  newTripFields.forEach( (field) => {
    const val = $(`input[name=${field}]`).val();
    if (val !== '') {
      tripData[field] = val;
    }
  });
  const trip = new Trip(tripData);
  if (trip.isValid()) {
    tripList.add(trip);
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave,
    });
  } else {
    // getting here means there were client-side validation errors reported
    updateStatusMessageFrom(trip.validationError);
  }
},
successfulSave(trip, response) {
  $('#message').show();
  $('#message').html('<p> Trip Added! </p>')
  $('#message').delay(2000).hide(1);
  $.modal.close();
  $.modal.empty;
},
failedSave(trip, response) {
  updateStatusMessageFrom(response.responseJSON.errors);
  trip.destroy();
},
sortTrips(event) {
  // Get the class list of the selected element
  const classes = $(this).attr('class').split(/\s+/);
  classes.forEach((className) => {
    if (filteredList) {
      if (newTripFields.includes(className)) {
        if (className === filteredList.comparator) {
          filteredList.models.reverse();
          renderFiltered(filteredList);
        } else {
          filteredList.comparator = className;
          filteredList.sort();
          renderFiltered(filteredList);
        }
      }
    } else if (newTripFields.includes(className)) {
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
  const e = document.getElementById('filterSelector');
  const searchCategory = e.options[e.selectedIndex].text;
  const searchTerm = document.getElementById('searchBar').value;
  let filteredTrips = tripList;
  const wordSearches = ['name', 'category', 'continent'];
  const numericSearches = ['weeks', 'cost'];
  if (wordSearches.includes(searchCategory.toLowerCase())) {
    filteredTrips = tripList.filter(trip => trip.get(searchCategory.toLowerCase()).includes(searchTerm)
  )
} else if (numericSearches.includes(searchCategory.toLowerCase())) {
  filteredTrips = tripList.filter(trip => trip.get(searchCategory.toLowerCase()) <= (searchTerm));
}
filteredList = new TripList(filteredTrips);
renderFiltered(filteredList);

},
};

$('#all_trips_section').hide();

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  showTemplate = _.template($('#show-template').html());

  tripList.fetch();

  $('#trips_button').click(events.allTrips);

  $('#trip-list').on('click', 'tr', function() {
    $('.current-select-row').removeClass('current-select-row');
    const tripID = $(this).attr('data-id');
    $(this).addClass('current-select-row');
    events.showTrip(tripID);
  });

  $('#show_trip').on('submit', 'form', events.finalizeReservation);
  $('#newTrip').submit(events.addTrip);

  $('.sort').click(events.sortTrips);
  tripList.on('sort', render, tripList);
  $('#searchBar').on('change keyup', renderFiltered, events.filterTrips)

});
