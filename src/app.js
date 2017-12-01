// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
// let tripTemplate;

// const allTrips= () => {
//   const tripsTable = `<h2>All Trips</h2>
//     <table>
//       <thead>
//         <th class="sort id">ID</th>
//         <th class="sort name">name</th>
//         <th class="sort continent">Continent</th>
//         <th class="sort category">Category</th>
//         <th class="sort weeks">Weeks</th>
//         <th class="sort cost">Cost</th>
//       </thead>
//       <tbody id="trip-list">
//       </tbody>
//     </table>`;
//   $('#all-trips').append(tripsTable);
//   render(tripList);
// };

// const tripInfo= () => {
//   console.log('called TripInfo');
//   console.log(this);
// };
const formFields = ['name', 'continent', 'category', 'cost', 'about', 'weeks', 'id'];

const events = {
  allTrips(event) {
    $('#all-trips').empty();
    const tripsTable = `<h2>All Trips</h2>
      <table>
        <thead>
          <th class="sort id">ID</th>
          <th class="sort name">name</th>
          <th class="sort continent">Continent</th>
          <th class="sort category">Category</th>
          <th class="sort weeks">Weeks</th>
          <th class="sort cost">Cost</th>
        </thead>
        <tbody id="trip-list">
        </tbody>
      </table>`;
    $('#all-trips').append(tripsTable);
    render(tripList);
  },
  sortTrips(event) {
    console.log('sorting');
    $('.current-sort-field').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');
    const classes = $(this).attr('class').split(/\s+/);
    // tripList.comparator = classes[1];
    console.log(this);
    console.log(classes);
    // console.log(tripList.comparator);
    classes.forEach((className) => {
      if (formFields.includes(className)) {
        if (className === tripList.comparator) {
          console.log('now reversing');
          tripList.models.reverse();
          tripList.trigger(('sort'), tripList);
        } else {
          console.log('now sorting');
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });

  },
  tripInfo(event) {
    console.log('called TripInfo');
    console.log(this.id);
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
    console.log(this);
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
      $('#messages').html(`<h3 id= "status-message"> Successfully reserved this trip for ${response.name}</h3>`);
      console.log(`Success! You're on the list.`);
      $('#trip-info').toggle();
      $('#trip-details form:last-child').empty();
    }).fail(() => {
      $('#messages').html('<h3 id= "status-message"> Sorry, there are no spots left for this trip.</h3>');
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

      $('#messages ul').empty();

      errorTypes.forEach((type) => {
        const eMessages = trip.validationError[type];
        eMessages.forEach((message) => {
          $('#messages ul').append(`<li> ${message}</li>`);
        });
      });

      $('#messages').show();
    }
  },
  successfulSave(trip, response) {
    console.log('success! the successfulsave method worked');
    // console.log(trip);
    // console.log(response);
    $('#messages ul').empty();
    $('#messages ul').append(`<li>${trip.get('name')} succesfully added!</li>`);
    $('#messages').show();
  },
  failedSave(trip, response) {
    console.log('fail :( we are in the failedSave method');
    console.log(trip);
    console.log(response);
    $('#messages ul').empty();
    const errs = response.responseJSON.errors;
    for (let key in errs) {
      errs[key].forEach((error) => {
        $('#messages ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#messages').show();
    trip.destroy();
  },
};
const render= function render(tripList) {
  $('#trip-list').empty();
  tripList.fetch();
  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};
let tripTemplate;
let showTemplate;
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  showTemplate = _.template($('#show-template').html());
  $('#all-trips-btn').click(events.allTrips);
  $('#all-trips').on('update', render);
  $('#all-trips').on('click', '.trip', events.tripInfo);
  $('#trip-details').on('click', '#reserve-btn', events.reservationForm);
  $('#trip-details').on('submit', '#reservation-form', events.finalizeReservation);
  $('body').on('click', '#add-trip-btn', events.newTripForm);
  $('#trip-details').on('submit', '#new-trip-form', events.addTrip);
  $('#all-trips').on('click', '.sort', events.sortTrips);
  tripList.on('sort', render, tripList);

});
