// Vendor Modules
// import ‘jquery-modal’
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

console.log('it loaded!');

const tripList = new TripList();

const render = function(tripList) {
  const tripTemplate = _.template($('#trip-template').html());
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append($(tripTemplate(trip.attributes)).attr('id', `${trip.id}`));
  })
}

//next: reserve a spot on a trip. need
// 1. method to add/post
// 2. validations to ensure required data is present
// 3. error messages
// 4.
const reservationFields = ['name', 'age', 'email']
const tripFields = ['name', 'continent', 'about', 'weeks', 'cost', 'category'];
const events = {
  addTrip(event) {
    console.log("I want to make a new trip");
    event.preventDefault();
    const tripData = {};
    tripFields.forEach((field) => {
      const value = $(`input[name=${field}]`).val();
      if (value !== "") {
        tripData[field] = value
      }
    });

    const trip = new Trip(tripData);
    console.log("this trip is: ")
    console.log(trip);
    console.log("Trip not yet saved.")

    if (trip.isValid()){
      console.log("SUCCESSSSSSS")
      console.log();
      tripList.add(trip)
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
      console.log("Now the trip has been saved.")
    } else {
      console.log("What's on book is invalid on the client side")
      console.log(trip)
    }
  },
  successfulSave(trip, response) {
    console.log("Successful Save!")
    // $('#status-messages ul').empty();
    // $('#status-messages ul').append(`<li>${trip.get('title')} added!!!!!!!!!!!!!!!!</li>`)
    // $('#status-messages').show();
  },

  failedSave(trip, response){
    console.log("Failed Save");
    // for (let key in response.responseJSON.errors) {
    //   response.responseJSON.errors[key].forEach((error) => {
    //     $('#status-messages ul').append(`<li>${key}: ${error}</li>`)
    //   })
    // }
    // $('#status-messages').show()
    trip.destroy();
  },

  // reserveSpot: function(event) {
  //   console.log("I want to reserve a trip");
  //   event.preventDefault();
  //   const reservationData = {}
  //     fields.forEach((field) => {
  //       const val = $(`input[name=${field}]`).val();
  //       if (val != '') {
  //         reservationData[field] = val;
  //       }
  //     });
  //
  //     //need a new model, reservation.
  //     const reservation = new Reservation(reservationData)
  //     reservation.save()
  //     console.log(reservation);
  //   }
}

$(document).ready( () => {
  $('#newTripForm').hide();
  $('#bookingForm').hide(); //hide the form
  $('#all-trips').hide();
  tripList.on('update', render, tripList); // renders the trip list each time update is called.
  tripList.fetch(); //fetches the trip list from the API

  $('#show-all').on('focus', function(){
    $('#trip-description').empty(); // removes any previously appended info from the trip description section
    $('#newTripForm').hide()
    $('#all-trips').show(); // shows all trips.
  });

  $('#trip-list').on('click', 'tr', function(){ // when you focus a row in the table
    $('#trip-description').empty();
    const tripTemplate = _.template($('#description-template').html()); //make a new template for the new section (for displaying individual trips)
    const trip = new Trip(this) //create a new instance of trip because it doesn't yet exist.
    trip.fetch({}, ).done(() => {$('#trip-description').html($(tripTemplate(trip.attributes)))}) // fetch a new trip. the first arg means "fetch the entire object". //.done waits until it is done loading; this is necessary because it loads asynchronously. arrow function appends the fetched attributes to the specified feild.


    $('#bookingForm form').remove('action') // takes off any previously appended action links
    $('#bookingForm form').attr('action', `https://trektravel.herokuapp.com/trips/${trip.id}/reservations`) //appends a new one.
    $('#bookingForm').show(); //shows the form.
  });

  // $('#bookingForm').submit(events.reserveSpot(this.get('id')));
  $('#new-trip').on('focus', function(){
    $('#newTripForm').show();
  });

  // $('#newTripForm').submit(events.addTrip);
  $('#newTripForm').on('click', 'button', events.addTrip);
});
