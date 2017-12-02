// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
let filteredMatches;

// modal stuff
const modal = $('#myModal');

// Get the <span> element that closes the modal
const closeBtn = $('.close')[0];

const formFields = ['name', 'continent', 'category', 'cost', 'about', 'weeks', 'id'];

const events = {
  allTrips(event) {
    $('#trip-details').empty();
    $('#filter-form')[0].reset();
    render(tripList);
    $('#all-trips').toggle();
  },
  sortTrips(event) {
    $('.current-sort-field').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');
    const classes = $(this).attr('class').split(/\s+/);
    classes.forEach((className) => {
      if (formFields.includes(className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger(('sort'), tripList);
        } else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });

  },
  tripInfo(event) {
    const trip = new Trip({id: this.id});

    trip.fetch({
      success: function (trip,response) {
        // trip is the Backbone model instance, response is the JSON object
        $('#trip-details').empty();
        $('#trip-details').append(showTemplate(trip.attributes));
      },
    })

    // trip.fetch({
    //   success: function(){
    //     $('#content').html(new usersView({
    //       collection: users
    //     }).render().el);
    //   },
    // });

  },
  reservationForm(event) {
    const tripID = this.getAttribute("data-trip-id");
    console.log(`You've clicked the make reservation button!`);
    console.log(`you are reserving this trip with id ${tripID}`);
    const reservationForm = `<form id= "reservation-form" action="https://trektravel.herokuapp.com/trips/${tripID}/reservations" method="post">
    <section>
      <label>Name</label>
      <input type="text" id="name" name="name"></input>
      <label>Email</label>
      <input type="text" id="email" name="Email"></input>
    </section>

    <section class="button">
      <button type="submitReservation">Reserve My Spot</button>
    </section>
    </form>`;
    $('#trip-details').append(reservationForm);
  },
  finalizeReservation(event) {
    event.preventDefault();
    console.log('you have submitted your form');
    const formData = $(this).serialize();
    const url = $(this).attr('action');
    $.post(url, formData, (response) => {
      $('#status-messages ul').html(`<li> Successfully reserved this trip for ${response.name}</li>`);
      console.log(`Success! You're on the list.`);
      $('#trip-info').toggle();
      $('#trip-details form:last-child').empty();
    }).fail(() => {
      $('#status-messages').html('<h3 id= "status-message"> Sorry, there are no spots left for this trip.</h3>');
      console.log(`Sorry, no spots left.`);
    });
  },
  newTripForm(event) {
    const tripForm = `
    <h2> Add New Trip </h2>
    <form id= "new-trip-form" action="https://trektravel.herokuapp.com/trips" method="post">
    <section>
      <label>Name:</label>
      <input type="text" id="name" name="name"></input>
      <label>Category:</label>
      <input type="text" id="category" name="category"></input>
      <label>Continent:</label>
      <input type="text" id="continent" name="continent"></input>
      <label>Cost:</label>
      <input type="integer" id="cost" name="cost"></input>
      <label>Weeks:</label>
      <input type="integer" id="weeks" name="weeks"></input>
      <label>About:</label>
      <input type="text" id="about" name="about"></input>
    </section>

    <section class="button">
      <button type="submit-new-trip">Add New Trip</button>
    </section>
    </form>`;
    $('#trip-details').empty();
    console.log('adding new trip form to page');
    $('#trip-details').append(tripForm);
  },
  addTrip(event) {
    const modal = document.getElementById('myModal');
    event.preventDefault();
    const tripData = {};
    formFields.forEach((field) => {
      const formValue = $(`input[name=${field}]`).val();
      if (formValue && formValue != ' ') {
        tripData[field] = formValue;
      }
    });

    const trip = new Trip(tripData);
    console.log('testing: this is the new trip');
    console.log(trip);
    if (trip.isValid()) {
      console.log('this trip is valid')
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
      // render(tripList);
    } else {
      console.log('there was a client error for this trip');
      const errorTypes = Object.keys(trip.validationError);
      $('#add-trip-error-msgs h3').html(`<h3>Error:</h3>`);
      $('#add-trip-error-msgs ul').empty();

      errorTypes.forEach((type) => {
        const eMessages = trip.validationError[type];
        eMessages.forEach((message) => {
          $('#add-trip-error-msgs ul').append(`<li> ${message}</li>`);
        });
      });
      $('#add-trip-error-msgs').show();
      // setTimeout(clearErrorMessages,10000);
    }
  },
  successfulSave(trip, response) {
    const modal = document.getElementById('myModal');
    console.log('success! the successfulsave method worked');
    // console.log(trip);
    // console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} succesfully added!</li>`);
    modal.style.display = "none";
    $('#status-messages').show();
    $('#new-trip-form')[0].reset();
    console.log($('#status-messages'));
    setTimeout(clearErrorMessages,8000);
    // setTimeout($('#messages').hide(), 2000);
  },
  failedSave(trip, response) {
    console.log('fail :( we are in the failedSave method');
    console.log(trip);
    console.log(response);
    $('#add-trip-error-msgs h3').html(`<h3>Error:</h3>`);
    $('#add-trip-error-msgs ul').empty();
    const errs = response.responseJSON.errors;
    for (let key in errs) {
      errs[key].forEach((error) => {
        $('#add-trip-error-msgs ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    // $('#add-trip-error-msgs').show();
    $('.messages').show();
    console.log('did the messages show');
    // setTimeout(clearErrorMessages,5000);
    // setTimeout($('#messages').hide(), 3000);
    trip.destroy();
  },
  filtering() {
    const filterCategory = $('#filter-category :selected').val().toLowerCase();
    const filterInput = $('#filter-query').val().toLowerCase();
    const numeric = ['weeks','cost', 'id'];
    const text = ['name', 'category', 'continent'];
    // console.log(filterCategory);
    // console.log(filterInput);
    // const filteredTrips = tripList.filter( trip => { (trip.get(filterCategory)).includes(filterInput);
    // });
    let matches = [];
    if (numeric.includes(filterCategory)) {
      tripList.forEach( (trip) => {
        const tripValue = parseInt(trip.get(filterCategory));
        const userValue = parseInt(filterInput);
        if (tripValue <= userValue) {
          matches.push(trip);
        }
      });
    } else {
      tripList.forEach( (trip) => {
        const lowercased = trip.get(filterCategory).toLowerCase();
        if (lowercased.includes(filterInput)) {
          matches.push(trip);
        }
      });
    }

    filteredMatches = new TripList(matches);
    console.log(filteredMatches);
    showFiltered(filteredMatches);

    // console.log(filteredTrips);
  },
  highlightSelection(event) {
    console.log('the event is:');
    console.log(event);
    console.log('THIS is: ');
    console.log(this);
    // selection.css({'background-color': 'red'});
  },
};
const render= function render(tripList) {
  $('#trip-list').empty();
  tripList.fetch();
  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};
const showFiltered= function showFiltered(filteredMatches) {
  $('#trip-list').empty();
  filteredMatches.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};
const clearErrorMessages= function clearErrorMessages() {
  // const messageSections = $('.messages').toArray();
  // console.log(messageSections);
  // messageSections.forEach((section) => {
  //   console.log(section);
  //   section.hide();
  //   section.empty();
  //   console.log('hid the messages teehee');
  // });
  const messageSections = $('.messages');
  messageSections.hide();
  $('.messages ul').empty();
  console.log('hid the messages teehee');
  console.log(messageSections);
};
let tripTemplate;
let showTemplate;
$('#all-trips').hide();
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  showTemplate = _.template($('#show-template').html());
  $('#all-trips-btn').click(events.allTrips);
  $('#all-trips').on('update', render);
  $('#all-trips').on('click', '.trip', events.tripInfo);
  $('#trip-details').on('click', '#reserve-btn', events.reservationForm);
  $('#trip-details').on('submit', '#reservation-form', events.finalizeReservation);
  // $('body').on('click', '#add-trip-btn', events.newTripForm);
  // $('#trip-details').on('submit', '#new-trip-form', events.addTrip);
  $('#myModal').on('submit', '#new-trip-form', events.addTrip);
  $('#all-trips').on('click', '.sort', events.sortTrips);
  tripList.on('sort', render, tripList);
  $('#all-trips').on('click', 'tr', events.highlightSelection);
  // $('#filter-category').on('change', events.filtering);
  $('#filter-query').on('keyup', events.filtering);
  // $('#filter-btn').on('click', $('#filter-form')[0].reset());

  // modal stuff

  // When the user clicks on the button, open the modal

  $('#add-trip-btn').on('click', function() {
    modal.css({'display': 'block'});
    // modal.style.display = "block";
  })
  // btn.onclick = function() {
  //     modal.style.display = "block";
  // }

  // When the user clicks on <span> (x), close the modal
  closeBtn.onclick = function() {
    modal.css({'display': 'none'});
      $('#new-trip-form')[0].reset();
      clearErrorMessages();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
        modal.css({'display': 'none'});
        $('#new-trip-form')[0].reset();
        clearErrorMessages();
      }
  }
});
