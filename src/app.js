// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// modules I've created:
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from  './app/models/reservation';

const TRIP_FIELDS = ['name', 'category', 'continent', 'cost', 'weeks'];

const  tripList = new TripList();
// const reservation = new Reservation();
let tripTemplate;
let individualTripTemplate;
let reserveTemplate;

//////////////////////////
// Status reporting
//////////////////////////
const clearStatus = function clearStatus() {
  $('#status-messages ul').html();
  $('#status-messages').hide();
};
const reportStatus = function reportStatus(status, message) {
  const statusHTML = `<li class="status${ status }">${ message }</li>`;
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

//////////////////////////
// Reservation Details ///
//////////////////////////
const addReservation = function addReservation(trip, formElement){
  let form = formElement;
  let formData = formElement.serialize(); // dont use serialize
  // read form otherwise and use data and create instance of reservation. and pass in tripID and call .save on that
  const success = function success(){
    $('#add-reservation').hide();
    reportStatus('success', 'Reservation Made!');
    console.log('success');
    form.find("input[type=text], input[type=number]").val('');
  };

  let url = `https://ada-backtrek-api.herokuapp.com/trips/${ trip.id }/reservations`;
  // const reservation = new Reservation( {tripId: trip.id});

  $.post(url, formData, success)
  .fail(function(){
    console.log('failure');
    reportStatus('error', 'Reservation failed!');
  });
};
//////////////////////////
// Trip Details
//////////////////////////
const showTripDetails = function showTripDetails(trip){
  console.log(trip.attributes); // has the about
  const individualTripListElement = $('#individual-trip-detail');
  individualTripListElement.html('');

  const generatedHTMLTripDetails = individualTripTemplate(trip.attributes);

  individualTripListElement.append(generatedHTMLTripDetails);
  $('#individual-trip-detail').show();

  //////////////////////////
  // reservation handler
  //////////////////////////
  $('#reserve').show(); //button display
  $('#reserve').on('click', function(event) {
    $('#add-reservation').show();
    $('#status-messages').html('');
  });
  $('#add-reservation').on('submit', function(event) {
    event.preventDefault();
    addReservation(trip, $(this));
  });
};
// pulled out fetchTripDetails function above
const fetchTripDetails = function fetchTripDetails(event) {
  $('#add-reservation').hide();
  let tripId = $(this).attr('data-id');
  let trip = tripList.get(tripId)
  trip.fetch({
    success: () => {
      showTripDetails(trip);
    }
  });
};


const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripListElement.append($(generatedHTML));

  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');

  $('.trip').on('click', fetchTripDetails);
};

const readFormData = function readFormData() {
  const tripData = {};
  TRIP_FIELDS.forEAch((field) => {
    const inputElement = $(`#add-trip-form input[name=${ field }]`);
    const value = inputElement.val();
    if (value != '') {
      tripDarta[field] = value;
    }
    inputElement.val('');
  });
  return tripData;
};

const handleValidationFailures = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};
const addTripHandler = function(event) {
  event.preventDefault();
  const trip = Trip(readFormData);
  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }
  tripList.add(trip);

  trip.save({}, {
    success: (model, response) => {
      console.log('successfully saved trip!');
      reportStatus('success', 'Successfully saved trip!');
      tripList.add(model);
    },
    error: (model, response) => {
      console.log('failed to save trip.');
      console.log(response);
      tripList.remove(model); // triggers an update (and rerender) server-side validation failed
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};

$(document).ready( () => {
  individualTripTemplate = _.template($('#individual-trip-template').html());
  tripTemplate = _.template($('#trip-template').html());
  // reserveTemplate = _.template($('#reserve-trip-template').html());
  // 11/30/17 not using this template

  tripList.on('update', render);
  tripList.on('sort', render);
  tripList.fetch(); //overrides anything youve added

  $('#add-trip-form').on('submit', addTripHandler);
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });
  $('#status-messages button.clear').on('click', clearStatus);
  $('#reserve').hide();
  $('#add-reservation').hide();
  // ///////// MODAL ///////// in doc ready? ///////
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
