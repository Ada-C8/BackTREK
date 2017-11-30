// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// Vars that need to be defined up front
let tripRowTemplate;
let tripDetailsTemplate;
let trip = new Trip();
const tripList = new TripList();
const fields = ['name', 'category', 'continent', 'weeks', 'cost', 'about']

// Callback functions
const render = function render(tripList) {
  $('#trip-list').empty(); // clear it so it doesn't continually add on
  tripList.forEach((trip) => {
    // use template to append trip row to table in the DOM
    $('#trip-list').append(tripRowTemplate(trip.attributes));
  });
};

const getTrip = function getTrip() {
  const id = $(this).attr('id');
  trip = tripList.get(id);
  trip.fetch({success: events.successfulGetTrip, error: events.failedGetTrip});
};

const getTripList = function getTripList() {
  tripList.fetch({success: events.successfulGetTripList, error: events.failedGetTripList});
}

const addTrip = function addTrip() {
  $('#form-modal').show();
}

const leaveForm = function leaveForm() {
  $('#form-modal').hide();
  $('#add-trip-form').trigger('reset');
  $('#in-form-status-message').hide();
}

const events = {
  successfulGetTrip(trip) {
    $('#trip-not-found').hide();
    $('#trip-info').empty();
    $('#trip-info').append(tripDetailsTemplate(trip.attributes))
  },
  failedGetTrip() {
    $('#trip-not-found').show();
  },
  successfulGetTripList() {
    $('#list-not-found').hide();
    $('#trip-table').show();
  },
  failedGetTripList() {
    $('#list-not-found').show();
  },
  addTrip(event) {
    event.preventDefault();
    $('#in-form-status-message').hide();

    console.log('triggered addTrip');
    const tripData = {};
    fields.forEach((field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    })
    const trip = new Trip(tripData);
    console.log(trip);

    console.log(tripList)
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave
    });
  },
  successfulSave(trip, response) {
    console.log('saved!')
    console.log(trip)
    console.log(response)
    $('#status-message h3').empty();
    $('#status-message h3').append(`${trip.get('name')} added!`)
    $('#status-message').show();
    tripList.add(trip);
    $('#form-modal').hide();
    $('#add-trip-form').trigger('reset');
  },
  failedSave(trip, response) {
    console.log('no can save')
    console.log(response)
    $('#in-form-status-message ul').empty();
    for(let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#in-form-status-message ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#in-form-status-message').show();
  },
};


$(document).ready( () => {
  tripRowTemplate = _.template($('#trip-row-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());
  $('#add-trip-form').submit(events.addTrip);
  $('#explore-trips').on('click', getTripList);

  tripList.on('update', render, tripList)

  $('#trip-list').on('click', 'tr', getTrip);
  $('#add-trip').on('click', addTrip);
  $('#form-modal').on('click', leaveForm);
  $(':button').on('click', leaveForm);
  $('#modal-content').click(function(e){ e.stopPropagation();});
});
