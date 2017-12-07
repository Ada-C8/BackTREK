// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip'
import TripList from './app/collections/trip_list'
import Reservation from './app/models/reservation'

let tripTemplate;
let individualTripTemplate;
let statusMessagesTemplate;

const tripList = new TripList();

const CONDENSED_TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const TRIP_FIELDS = ['name', 'about', 'continent', 'category', 'weeks', 'cost'];

const RESERVATION_FIELDS = ['name', 'email', 'tripId'];

//////////////////////reading forms/////////////////////////
const readReservationFormData = function readReservationFormData() {
  const reservationData = {};

  RESERVATION_FIELDS.forEach((field) => {
    const inputElement = $(`#reserve-trip input[name="${ field }"]`);
    const value = inputElement.val();

    reservationData[field] = value;
  });

  console.log("Read reservation data");
  console.log(reservationData);

  return reservationData;
};

const readAddFormData = function readAddFormData() {
  const tripData = {};

  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    tripData[field] = value;
  });

  console.log("Read trip data");
  console.log(tripData);

  return tripData;
};

//////////////////////status messages///////////////////////
const handleStatusMessages = (messages) => {
  console.log('In handleStatusMessages()');
  console.log(messages);

  $('#status-messages div').empty();

  let generatedHtml = statusMessagesTemplate(messages);
  console.log(generatedHtml);
  let messagesElem = $('#status-messages div');
  console.log(messagesElem);
  messagesElem.append(generatedHtml);
  $('#status-messages').show();
};

const clearStatus = function clearStatus() {
  $('#status-messages p').html('');
  $('#status-messages').hide();
};

const clearAddTripForm = function clearAddTripForm() {
  $('#trip-form-message').hide();
  // $('#trip-form-button').hide();
  $('#add-trip-form-close').hide();
}

const clearAllTripsTable = function clearAllTripsTable() {
  $('#trip-table').hide();
  $('#trip-table-close').hide();
  $('#filter-triplist').hide();
}

const clearIndividualTripDetails = function clearIndividualTripDetails() {
  $('#individual-trip-details').hide();
  $('#individual-trip-details-close').hide();
}
////////////////eventHandlers////////////////////
const showIndividualTripHandler = function showIndividualTripHandler(event) {
  console.log('in the trip click');
  $('html,body').scrollTop(0);

  let tripId = $(this).attr('data-id');
  let trip = tripList.get(tripId)
    trip.fetch({
      success: function(model) {
        const individualtripListElement = $('#individual-trip-details');

        individualtripListElement.html('');

        const generatedHTMLTripDetails = individualTripTemplate(model.attributes);
        individualtripListElement.append(generatedHTMLTripDetails);

        $('#individual-trip-details').show();
        $('#individual-trip-details-close').show();

        // Listen for submit event on #reserve-trip
        $('#reserve-trip').on('submit', addReservationHandler);
      }
    });
  };

const addTripHandler = function(event) {
  event.preventDefault();
  const trip = new Trip(readAddFormData());

  if (!trip.isValid()) {
    console.log('Client side error handling');
    handleStatusMessages(trip.validationError);
    return;
  }

  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      tripList.add(trip);
      $('#trip-form-message').hide();
      const successObject = {
        success: 'Successfully saved trip!',
      }
      handleStatusMessages(successObject);
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      handleStatusMessages(response.responseJSON["errors"]);
    },
  });
};

const addReservationHandler = function(event) {
  event.preventDefault();

  const reservation = new Reservation(readReservationFormData());

  if (!reservation.isValid()) {
    console.log('Client side error handling');
    handleStatusMessages(reservation.validationError);
    return;
  }

  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      $('#individual-trip-details').hide();
      $('#individual-trip-details-close').hide();
      const successObject = {
        success: 'Successfully made reservation!',
      }
      handleStatusMessages(successObject);
      reportStatus(successObject);
    },
    error: (model, response) => {
      console.log('Failed to make reservation! Server response:');
      console.log(response);
      handleStatusMessages(response.responseJSON["errors"]);
    },
  });
};

/////////////////////////filter///////////////////////////
const filter = function filter(event) {
  console.log(`In typing-search, this: ${this}`);
  console.log(`In #typing-search, event: ${$(this).val()}`);
  //declare filters
  // let filters = {};
  const letters = $(this).val().toLowerCase();

  console.log(`Letters:`);
  console.log(letters);

  console.log(`Selected header: ${$('#select-header').find(":selected").text()}`);

  const selectedHeader = $('#select-header').find(":selected").text().toLowerCase();
  // filters[selectedHeader] = letters;
  // console.log(`filter: ${filters}`);

  // render(tripList, filters);

  // tripList.filterSearch(filters);

  //filters[$('#filter option:selected')[0].innerHTML] = $('#filter input')[0].value;
  // loadTrips(tripList, filters)

  const filteredList = tripList.filterSearch(letters, selectedHeader);
  render(filteredList);
};

///////////render HTML for tripList//////////////
const render = function render(tripList) {

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  // TODO: inline event handler so we get a closure for trips
  // tripList.forEach((trip) => {
  // const genhtml = $(tripTemplate(trip.attributes));
  // genhtml.on('click', (event) => {
  // renderDetails(trip);
  // });
  // tripTable.append(genhtml);
  // const listOfTrips = tripList.filterSearch(filters);

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  })

  $('#trip-table').show();
  $('#trip-table-close').show();
  $('#filter-triplist').show();
  // $('#trip-form-button').show();

  //Visual feedback code for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${tripList.comparator}`).addClass('current-sort-field');

  //Listen for click event on .trip
  $('.trip').on('click', showIndividualTripHandler);
};

///////////////////document.ready///////////////////

$(document).ready( () => {
  // compile templates
  tripTemplate = _.template($('#trip-template').html());

  individualTripTemplate = _.template($('#individual-trip-template').html());

  statusMessagesTemplate = _.template($('#status-messages-template').html());

  // Register update listener first, to avoid the race condition
  tripList.on('update', render);

  //Listen for sort event when user clicks on column
  tripList.on('sort', render);

  // Listen for click event on #all-trip
  $('#all-trips').on('click', function() {
    console.log('#all-trip has been clicked, in event handler');
    tripList.fetch();
    console.log('#all-trip has been clicked, in event handler, after fetch()');
  });

  // Listen for user click on add trip button
  $('#add-trip').on('click', function() {
    console.log('#add-trip clicked');
    $('#trip-form-message').show();
    // $('#trip-form-button').show();
    $('#add-trip-form-close').show();
  });

  // Listen for when user submits trip form
  $('#add-trip-form').on('submit', addTripHandler);

  // Listen for clearing status messages
  $('#status-messages button.clear').on('click', clearStatus);

  // Listen for clearing add trip form
  $('#add-trip-form-close').on('click', clearAddTripForm);

  // Listen for clearing all trips table
  $('#trip-table-close').on('click', clearAllTripsTable);

  // Listen for clearing individual trip details
  $('#individual-trip-details-close').on('click', clearIndividualTripDetails);

  // Build event handlers for each of the table headers
  CONDENSED_TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);
    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  //TODO: FILTERING
  // Listen for search typing
  $('#typing-search').keyup(filter);
});
