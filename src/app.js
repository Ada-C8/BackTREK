// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';


import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
console.log(tripList);

let tripTemplate;
let showTemplate;

const reservationFields = ['name', 'age', 'email'];
const newTripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost']

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

const renderFiltered = function(filteredList) {
  console.log('INSIDE renderFiltered');
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
      $('#status-messages ul').append($(`<li>${messageType}:  ${message}</li>`));
    })
  }
  $('#status-messages').show();
}

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`${message}</li>`);
  console.log($('#status-messages ul'))
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
    <form id="reserve-trip-form" action="https://trektravel.herokuapp.com/trips/${id}/reservations" method="post">
    <label for="name" required="required">Name</label>
    <input type="text" name="name"></input>

    <label for="age">Age</label>
    <input type="number" name="age"></input>

    <label for="email" required="required">Email</label>
    <input type="text" name="email"></input>

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
    const formData = $(this).serialize();

    $('#show_trip').hide();
    $.post(url, formData, function(response) {
      $('#message').empty();
      $('#message').html('<p> Trip Reserved! </p>');
      $('#message').delay(1000).hide(1);
    }).fail(() => {
      $('#message').empty();
      $('#message').html('<p>Reserving Trip Failed</p>');
      $('#message').delay(2000).hide(1);
    });
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
    console.log(trip);
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
      if (newTripFields.includes(className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        } else {
          tripList.comparator = className;
          console.log(tripList.comparator);
          tripList.sort();
        }
      }
    });
    $('.current-sort-field').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');
  },
  filterTrips(event) {
    console.log("IN FILTER TRIP FUNCTION")
    const e = document.getElementById('filterSelector');
    const searchCategory = e.options[e.selectedIndex].text;
    console.log(searchCategory);
    const searchTerm = document.getElementById('searchBar').value;
    let filteredTrips = tripList;
    const wordSearches = ['name', 'category', 'continent'];
    const numericSearches = ['weeks', 'cost'];
    if (wordSearches.includes(searchCategory.toLowerCase())) {
      filteredTrips = tripList.filter(trip => trip.get(searchCategory.toLowerCase()).includes(searchTerm)
    )
    console.log(filteredTrips);
    // return const filteredList = new TripList(filteredTrips);
  } else if (numericSearches.includes(searchCategory.toLowerCase())) {
    filteredTrips = tripList.filter(trip => trip.get(searchCategory.toLowerCase()) <= (searchTerm));
    console.log(filteredTrips);
  }
  // console.log(filteredTrips);
  const filteredList = new TripList(filteredTrips);

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
  // tripList.on('filterTrips', render, tripList);

});
