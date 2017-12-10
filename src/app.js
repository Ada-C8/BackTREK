// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

import TripList from './app/collections/trip_list';

import Trip from './app/models/trip';
import Reservation from './app/models/reservation';

const tripList = new TripList();

const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

const RESERVATION_FIELDS = ['name', 'trip_id', 'email' ];

const render = function render(tripList) {
  $('.clear').hide();
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
    $(`#trip${trip.attributes.id}`).on('click', (event) => {
      let tripDetails = new Trip({id: `${trip.attributes.id}`});
      tripDetails.fetch({
        success: renderDetails
      });
    });
    $('th.sort').removeClass('current-sort-field');
    $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
  });
};

const renderDetails = function renderDetails(tripDetails){
  const $detailsElement = $('#oneTrip');
  console.log('found detailsElement?', $detailsElement)
  $detailsElement.html('');

  const generatedHTML = detailsTemplate(tripDetails.attributes);
  $detailsElement.append(generatedHTML);

  $('#goReservationForm').on('click', function(event) {
    renderReservationForm(event, tripDetails);
  });
};

const renderReservationForm = function renderReservationForm(event, tripDetails){
  $('#goReservationForm').hide();
  const tripId = tripDetails.attributes.id
  const $spaceReservationForm = $('#spaceReservationForm');
  $spaceReservationForm.html('');
  const generatedHTML = reservationTemplate({tripId: tripId});
  // console.log(generatedHTML);
  $spaceReservationForm.append(generatedHTML);
  // nuevas cosas
  event.preventDefault();
  $('#submitForm').on('click', reserveTripHandler);
};

const  reserveTripHandler = function reserveTripHandler(event){
  event.preventDefault();
  console.log('inside reserveTripHandler');
  let reservationData = {};

  RESERVATION_FIELDS.forEach((field) =>{
    const inputElement = $(`#reservation-form input[name="${ field }"]`);
    const value = inputElement.val();
    reservationData[field] = value;
    inputElement.val('');
  });
  const reservationEnterUser = new Reservation(reservationData);
  console.log(`reservationEnterUser ${reservationEnterUser}`);
  console.log(reservationEnterUser);
  reservationEnterUser.save({}, { success: (model, response) => {
    reportStatus('success', 'Make your bags. You reserve this trips Successfully!');
    console.log("reservation went great");
  }, error: (model, response) => {

    const errors = response.responseJSON["errors"];
    for (let field in errors) {
      for (let problem of errors[field]) {
        reportStatus('error', `${field}: ${problem}`);
      }
    }
  }
});
};

const addTripHandler = function(event) {
  event.preventDefault();

  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;

    inputElement.val('');
  });
  const tripEnterUser =  new Trip(tripData);

  tripEnterUser.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error', `${field}: ${problem}`);
        }
      }
    },
  });
};


let tripTemplate;
let detailsTemplate;
let reservationTemplate;

// Clear status messages
const clearStatus = function clearStatus() {
  $('.clear').hide();
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);
  $('.clear').show();

  const statusHTML = `<li class="${ status }">${ message }</li>`;

  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html());
  detailsTemplate = _.template($('#details-template').html());
  reservationTemplate = _.template($('#reservationFormTemplate').html());

  tripList.on('update', render);

  tripList.fetch();

  tripList.on('sort', render);

  $('#add-trip-form').on('submit', addTripHandler);

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  $('#status-messages').on('click', clearStatus);

});
