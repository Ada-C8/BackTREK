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
// Status reporting /////
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
// Trip Details /////////
//////////////////////////
const showTripDetails = function showTripDetails(trip){
  const individualTripListElement = $('#individual-trip-detail');
  individualTripListElement.html('');

  const generatedHTMLTripDetails = individualTripTemplate(trip.attributes);

  individualTripListElement.append(generatedHTMLTripDetails);
  $('#individual-trip-detail').show();

  //////////////////////////
  // Reservation Details ///
  //////////////////////////
  const reserveTrip = (event) => {
    event.preventDefault();
    console.log('in reserveTrip');
    const RES_FIELDS = ['trip_id', 'name', 'age', 'email'];
    let reservationData = {}
    RES_FIELDS.forEach((field) => {
      const input = $(`#add-reservation input[name="${ field }"]`);
      const val = input.val();
      if (val != '') {
        reservationData[field] = val;
      }
      input.val('');
    })
    // HERE IS THERE ERROR
    
    const reservation = new Reservation(reservationData);
    console.log(reservationData);
    console.log(reservation);
    if (!reservation.isValid()) {
      handleValidationFailures(reservation.validationError);
      return;
    }
    reservation.save({}, {
      success: (model, response) => {
        console.log('success');
        reportStatus('success', 'Trip reserved!');
        $('#add-reservation').hide();
      },
      error: (model, response) => {
        console.log(response);
        console.log(response.responseJSON["errors"]);
        reportStatus('error', 'Not reserved!')
        handleValidationFailures(response.responseJSON["errors"]);
      },
    });
  };
  //////////////////////////
  // reservation handler ///
  //////////////////////////
  const reserveTemplateShow = function reserveTemplateShow(trip){ // not able to pass data in
    // clearStatus(); ?
    const reservationElement = $('#reservation-form');
    reservationElement.html('');
    const generatedHTMLreserve = reserveTemplate(trip.attributes);
    console.log(trip.attributes);
    reservationElement.append(generatedHTMLreserve);
    // $('#reservation-form').show();
  };

  $('#reserve').show();
  $('#reserve').on('click', function(event) {
    // event.preventDefault();
    reserveTemplateShow(trip);
    // $('#add-reservation').show();
    // clearStatus();
    $('#reserve').hide();

    // trying to submit the data When submit is pressed, it reloads the page! and no data is saved...
    // $('#add-reservation').load(function(event){
    $('#add-reservation').on('submit', function(event) {
      event.preventDefault();
      // debugger

      console.log('on submit');

      reserveTrip(event);
    });
    // });
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

//////////////////////////
// sorting ///////////////
//////////////////////////
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

//////////////////////////
// Add a Trip  ///////////
//////////////////////////

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
  // debugger
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
//////////////////////////
// DOC.READY /////////////
//////////////////////////

$(document).ready( () => {
  modal = $('#myModal')

  individualTripTemplate = _.template($('#individual-trip-template').html());
  tripTemplate = _.template($('#trip-template').html());
  reserveTemplate = _.template($('#reserve-trip-template').html());

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

  //////////////////////////
  // MODAL! ///////////////
  //////////////////////////
  const showAddForm = function showAddForm() {
    modal.css("display", "block")
    $('#close').on('click', function(){
      modal.hide();
    });

    $('body').on('click', '.modal-close', function(event){
      if($(event.target).hasClass('modal-close')) {
        modal.hide();
      }
    });
  };
  $('#add-trip-button').on('click', showAddForm);

});
