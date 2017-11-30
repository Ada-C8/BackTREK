// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';

const tripList = new TripList();
let tripTemplate;
let tripDetails;
let registrationTemplate;

const render = function render(event) {
  const tableElement = $('#trip-list');
  tableElement.html('');

  tripList.forEach((trip) => {
    if (!trip.get('id')) {
      console.log('this is a bad trip');
      console.log(trip);
    } else {
      const generatedHTML = tripTemplate(trip.attributes);
      tableElement.append(generatedHTML);
    }
  });
};

const showTrips = function showTrips(event) {
  $('#trips-table').show();
  $('.centerbutton').hide();
};

const showTripDetails = function showTripDetails(event) {
  const trip = tripList.get($(this).attr('data-id'))

  trip.fetch({
    success: (model, response) =>{
      console.log('trip fetch success');
      console.log(model);
      const generatedHTML = tripDetails(trip.attributes);
      $('#trip-details').html(generatedHTML)
    },
    failure: (model, response) => {
      console.log('trip fetch failure');
      reportStatus('success', 'Trip temporarilty unavailable');
    }
  });
};

const loadRegistrationForm = function loadRegistrationForm(event) {
  const generatedHTML = registrationTemplate();
  $('.sign-up').hide();
  $('#trip-details').append(generatedHTML);
};

const addReservationHandler = function addReservationHandler(event) {

  // event.preventDefault();
  // const reservationData;
  // ToDo: come backkkkk
};

const addTripHandler = function(event) {
  event.preventDefault();

  const tripData = {};
  ['name', 'continent', 'category', 'cost', 'weeks', 'about'].forEach((field) => {
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;

    inputElement.val('');
  });

  const trip = tripList.add(tripData);

  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportStatus('success', 'Successfully saved book!');
      $('#add-trip').hide();

    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error', `${field}: ${problem}`);
        }
      }
    },
  });

};


const loadModal = function loadModal(event) {
  $('#add-trip').show();
};

const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);

  // Should probably use an Underscore template here.
  const statusHTML = `<li class="${ status }">${ message }</li>`;

  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

$(document).ready( () => {

  $('#trips-table').hide();
  $('#add-trip').hide();

  tripDetails = _.template($('#trip-info').html());
  tripTemplate = _.template($('#trip-template').html());
  registrationTemplate = _.template($('#registration-form').html());


  $('#load').on('click', showTrips);

  tripList.on('update', render)

  tripList.fetch();

  $('#trips-table').on('click', '.trip-name', showTripDetails);

  $('#trip-details').on('click', '.sign-up', loadRegistrationForm)

  $('.res-form').on('submit', addReservationHandler);

  $('#add-trip-form').on('submit', addTripHandler);

  $('#add-trip-button').on('click', loadModal);

  $('#status-messages button.clear').on('click', clearStatus);
});
