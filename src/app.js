// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

//console.log('it loaded!');

//TRIPS TABLE:
const tripList = new TripList();
let tripsTemplate;


const renderTrips = function renderTrips(tripList) {
  console.log('it loaded!');
  $('#load-trips').hide();
  $('#add-new-trip').show();
  tripsTemplate = _.template($('#trips-template').html());
  //get the element to append to
  const tripListTable = $('#trips-list');
  tripListTable.empty();
  tripList.forEach((trip) => {
    tripListTable.append(tripsTemplate(trip.attributes));
    //console.log(trip);
  });
  console.log('finished loading trips')
};

//TRIP DETAILS (ONE TRIP)
let singleTripTemplate;
const renderSingleTrip = function renderSingleTrip(tripID) {
  console.log('it loaded a trip!');
  console.log(tripID);
  const tripDetailsContainer = $('#trip-details-container');
  tripDetailsContainer.empty();
  //why am i defining let singleTripTemplate outsie of method instead of inside?
  singleTripTemplate = _.template($('#single-trip-template').html());
  let trip;
  trip = new Trip({id: tripID});
  trip.fetch().done(() => {
    $('#trip-details-container').append(singleTripTemplate(trip.attributes));
  });
  console.log(trip);
}

//EVENT LISTENER
//1. Create listener:
// const bogusListener = function bogusListener(event)  {
//   console.log('Event Occurred!');
//   console.log(event);
//   console.log(this);
// };
// // // 2.  Register the Event Handler with the Component
// tripList.on('bogus', bogusListener);
// // // 3.  Trigger the event
// tripList.trigger('bogus', 'Argument!');

const fields = ["name", "category", "continent", "cost", "weeks", "about"];

const events = {
  addTrip(event) {
    event.preventDefault();
    console.log('in addTrip method! Trip Data:')
    const tripData = {};
    fields.forEach( (field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    });
    console.log(tripData);
    const trip = new Trip(tripData);

    if (trip.isValid()) {
      trip.save({}, {
        success: events.successfullSave,
        error: events.failedSave,
      });
    } else {
      console.log('NOT VALID')
      events.failedSave(trip, {errors: trip.validate() });
    }

    console.log('finished')

  },
  successfullSave(trip, response) {
    console.log('successfulSave');
    tripList.add(trip);
    console.log('Trip Added');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`)
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('failedSave');
    console.log(trip);
    console.log(response);
    console.log(response.responseText);
    console.log(JSON.stringify(response));
    // tripList.remove(trip);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} WAS NOT added!</li>`)
    //$('#status-messages ul').append('<li><h1>MESSAGE</h1></li>');
    $('#status-messages ul').append(`<li>${response.responseText}</li>`);
    $('#status-messages').show();
  },
};

$(document).ready( () => {
  $('#reservation-form-container').hide();
  $('#add-a-trip-form-container').hide();
  $('#trips-table-container').hide();
  $('#add-new-trip').hide();

  $('#load-trips').on('click', function(){
    console.log('clicked load');
    $('#trips-table-container').show();
    tripList.fetch();
    // tripList.trigger();
    // createFilters();
  });

  $('#trips-table-container').on('click', 'tr', function () {
    const tripID = $(this).attr('data-id');
    renderSingleTrip(tripID);
    $('#reservation-form-container').show();
  });

  //show form to Add a Trip
  $('#add-new-trip').on('click', function() {
    $('#add-a-trip-form-container').show();
  });

  //submit form to Add a Trip
  //creates a new instance of the Trip model
  //tripsTemplate = _.template($('#trips-template').html());
    // $('#add-trip-form').on('click', function () {
    //   $('#add-trip-form').submit(events.addTrip);
    // });
    $('#add-a-trip-form-container').on('submit','#add-trip-form', events.addTrip);


  //update table
  tripList.on('update', renderTrips, tripList);


  // $('.sort').click(events.sortTrips);
  // tripList.on('sort',renderTrips,tripList);


});
