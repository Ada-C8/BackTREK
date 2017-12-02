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
let tripTemplate;
let individualTripTemplate;
let reserveTemplate;
let modal;

//////////////////////////
// Status reporting
//////////////////////////
const clearStatus = function clearStatus() {
  $('#status-messages ul').html();
  $('#status-messages').hide();
};
// to make this work we need an underscore template
const reportStatus = function reportStatus(status, message) {
  const statusHTML = `<li class="status${ status }">${ message }</li>`;
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

//////////////////////////
// Reservation Details ///
//////////////////////////
const reserveTrip = (event) => {
  event.preventDefault();
  // console.log('in reserveTrip');
  const RES_FIELDS = ['name', 'age', 'email', 'trip_id'];
  let reservationData = {}
  RES_FIELDS.forEach((field) => {
    const input = $(`#add-reservation input[name="${ field }"]`);
    const val = input.val();
    if (val != '') {
      reservationData[field] = val;
    }
    input.val('');
  })
  const reservation = new Reservation(reservationData);
  if (!reservation.isValid()) {
    handleValidationErrors(reservation.validationError, 'form');
    return;
  }
  reservation.save({}, {
    success: (model, response) => {
      console.log('success');
      reportStatus('success', 'Trip reserved!')
    },
    error: (model, response) => {
      console.log('Failure:');
      console.log(response);
      console.log(response.responseJSON["errors"]);
      // reportStatus?
      handleValidationErrors(response.responseJSON["errors"], 'form');
    },
  });
};

//////////////////////////
// Trip Details
//////////////////////////
const showTripDetails = function showTripDetails(trip){
  const individualTripListElement = $('#individual-trip-detail');
  individualTripListElement.html('');

  const generatedHTMLTripDetails = individualTripTemplate(trip.attributes);

  individualTripListElement.append(generatedHTMLTripDetails);
  $('#individual-trip-detail').show();

  //////////////////////////
  // reservation handler
  //////////////////////////
  const reserveTemplateShow = function reserveTemplateShow(reservation){ // not able to pass data in
    // clearStatus();
    const reservationElement = $('#reservation-form');
    reservationElement.html('');
    const generatedHTMLreserve = reserveTemplate(reservation.attributes);
    reservationElement.append(generatedHTMLreserve);
    $('#reservation-form').show();
  };

  $('#reserve').show();
  $('#reserve').on('click', function(event) {
    console.log('in reserve event');
    reserveTemplateShow();
    // $('#add-reservation').show();
    // clearStatus();
    // $('#reserve').hide();
  });

  $('#add-reservation').on('submit', (event) => {
    event.preventDefault();
    reserveTrip(event);
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
  const tripData = { id: null };
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#add-trip-form input[name=${ field }]`);
    const value = inputElement.val();
    if (value != '') {
      tripData[field] = value;
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
  const trip = new Trip(readFormData());
  clearStatus();
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
      modal.hide();
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
  modal = $('#myModal')

  individualTripTemplate = _.template($('#individual-trip-template').html());
  tripTemplate = _.template($('#trip-template').html());
  reserveTemplate = _.template($('#reserve-trip-template').html());
  // 11/30/17 not using this template

  tripList.on('update', render);
  tripList.on('sort', render);
  tripList.fetch(); //overrides anything youve added

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  $('#add-trip-form').on('submit', addTripHandler);
  $('#status-messages button.clear').on('click', clearStatus);
  $('#reserve').hide();
  $('#add-reservation').hide();

  // ///////// MODAL ///////// in doc ready? ///////
  const showAddForm = function showAddForm() {
    modal.css("display", "block")
    $('#close').on('click', function(){
      modal.hide();
    });

    // When the user clicks anywhere outside of the modal, close it
    $('body').on('click', '.modal-close', function(event){
      if($(event.target).hasClass('modal-close')) {
        modal.hide();
        // clearFormMessages();
      }
    });
    // window.onclick = function(event) {
    //   if (event.target == modal) {
    //     modal.style.display = "none";
    //   }
    // };
  };
  $('#add-trip-button').on('click', showAddForm);

});
