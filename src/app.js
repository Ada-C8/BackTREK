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
  // iterate through the bookList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
    $(`#trip${trip.attributes.id}`).on('click', (event) => {
      let tripDetails = new Trip({id: `${trip.attributes.id}`});
      // console.log(tripDetails.url());
      // tripDetails.on('update', renderDetails);
      tripDetails.fetch({
        success: renderDetails
      });
      // console.log(tripDetails);


      // renderDetails(tripDetails);
    });

  });
};

const renderDetails = function renderDetails(tripDetails){
  // tripDetails= new Trip()
  const $detailsElement = $('#oneTrip');
  console.log('found detailsElement?', $detailsElement)
  $detailsElement.html('');

  // const generatedHTML = $(detailsTemplate(tripDetails.attributes));
  const generatedHTML = detailsTemplate(tripDetails.attributes);
  // console.log(generatedHTML);
  // console.log(tripDetails.attributes);
  $detailsElement.append(generatedHTML);

  $('#goReservationForm').on('click', function(event) {
    renderReservationForm(event, tripDetails);
  });
};

const renderReservationForm = function renderReservationForm(event, tripDetails){
  // console.log('In renderReservationForm');
  // console.log(tripDetails.attributes);
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


  // const tripEnterUser = tripList.new(tripData);
  const tripEnterUser =  new Trip(tripData);
  // The first argument to .save is the attributes to save.
  // If we leave it blank, it will save all the attributes!
  // (Think of model.update in Rails, where it updates the
  // model and saves to the DB in one step). We need the second
  // argument for callbacks, so we pass in {} for the first.
  tripEnterUser.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportStatus('success', 'Successfully saved trip!');
      // tripList.add(model);
    },
    error: (model, response) => {
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error', `${field}: ${problem}`);




        }
      }
      // Since these errors come from a Rails server, the strucutre of our
      // error handling looks very similar to what we did in Rails.
      // const errors = response.responseJSON["errors"];
      // for (let field in errors) {
      //   for (let problem of errors[field]) {
      //     reportStatus('error', `${field}: ${problem}`);
      //   }
      // }
    },
  });
};


let tripTemplate;
let detailsTemplate;
let reservationTemplate;

// Clear status messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);

  // Should probably use an Underscore template here.
  const statusHTML = `<li class="${ status }">${ message }</li>`;
  // const close = `<button class="clear float-right">
  //   close
  // </button>`;
  // note the symetry with clearStatus()
  // $('#status-messages').append(close);
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

$(document).ready( () => {
  // When fetch gets back from the API call, it will add books
  // to the list and then trigger an 'update' event
  tripTemplate = _.template($('#trip-template').html());
  detailsTemplate = _.template($('#details-template').html());
  reservationTemplate = _.template($('#reservationFormTemplate').html());
  // console.log(`About to fetch data from ${ tripDetails.url() }`);

  // detailsTemplate = _.template($('#details-template').html());
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











  // tripDetails.fetch();
  // tripDetails.on()
});
