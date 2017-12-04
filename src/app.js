// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// collections and models
import TripList from 'app/collections/trip_list';
import Trip from 'app/models/trip';
import Reservation from 'app/models/reservation';

const TRIP_FIELDS = ['name', 'continent', 'category', 'about', 'weeks', 'cost']

// create the tripList to store the trips we access from the API
const tripList = new TripList();

// define the underscore templates at a global level so we can access it in the render function and other functions
let allTripsTemplate;
let tripDetailsTemplate;
let tripFormTemplate;
let statusTemplate;

// function to reserve a trip
const reserveTrip = (event) => {
  event.preventDefault();
  console.log('in reserveTrip');

  const RES_FIELDS = ['name', 'age', 'email', 'trip_id'];
  let resData = {}

  RES_FIELDS.forEach((field) => {
    const input = $(`#reservation-form input[name="${ field }"]`);
    const val = input.val();

    if (val != '') {
      resData[field] = val;
    }

    input.val('');
  }) // forEach

  const reservation = new Reservation(resData);

  console.log(`reservation`);
  console.log(reservation);

  // display client side validation error messages if the user entered invlalid input and break out of the function before you make the api request to post the reservation
  if (!reservation.isValid()) {
    handleValidationErrors(reservation.validationError, 'form');
    return;
  } // if isVALID

  reservation.save({}, {
    success: (model, response) => {
      console.log('successfully saved the reservation');
      reserveStatus('success', 'You are reserved for the trip!')
    }, // success
    error: (model, response) => {
      console.log('Failed to reserve the trip! Server response:');
      console.log(response);
      console.log(response.responseJSON["errors"]);

      handleValidationErrors(response.responseJSON["errors"], 'form');
    }, // error
  }) // save
} // reserveTrip

// funtion to generate the html for the trip details
const renderDetailsHtml = (model) => {
  // generate the HTML for the trip details
  let detailsHTML = tripDetailsTemplate(model.attributes)
  console.log(detailsHTML);

  // prepend the trip detail inside the trip-details article. Need to change classes as well to make foundation styling work
  $('#trip-table').addClass("large-5 column")
  $('#trip-details').addClass("large-5 column");
  $('#trip-details').empty();
  $('#trip-details').prepend(detailsHTML);

  // TODO: add an error function!

  // I need to define the click function for hide-trip details within the function that generates the html for the button
  $('#hide-details').on('click', hideDetails)

  // add click event for the reservation form in this HTML
  $('#reservation-form').on('submit', (event) => {
    event.preventDefault();
    reserveTrip(event);
  });

} // renderDetailsHtml

// function to show trip details
const renderDetails = (trip) => {
  console.log('in the renderDetails function');

  // get the id of the trip you clicked on
  let tripId = trip.get('id')

  // fetch the trip details of the trip you clicked on from the api
  // the new attributes fetch sets for the model need to be access in a callback function
  let currentTrip = tripList.get(tripId)

  // if we havn't already done an api call to updage the currentTrips attributes to have 'about' then do an api call, if not then just make the trip details from the attribute the currentTrip allready has access to!
  if (!currentTrip.get('about')) {
    currentTrip.fetch({
      success: function(model) {
        renderDetailsHtml(model);
      } // function
    }); // fetch
  } else {
    console.log('in the else! ');
    renderDetailsHtml(trip);
  }// if/else the currentTrip already has the about attribute
}

// function to hide the trip details
const hideDetails = function hideDetails() {
  $('#trip-details').empty();
  $('#trip-table').removeClass("large-5 column")
  $('#trip-details').removeClass("large-5 column");
}

// define a render function to call when tripList is updated or sorted
const render = function render(tripList) {
  // select the tbody element to append to
  const tripListElement = $('#trip-list')

  // empty the tbody before rendering
  tripListElement.empty();

  // make a tr for each trip
  tripList.forEach((trip) => {
    // use the underscore function to generate HTML for each trip
    let tripHTML = $(allTripsTemplate(trip.attributes));

    // add an event handler to each tr as it is created
    tripHTML.on('click', (event) => {
      renderDetails(trip);
    }) // tripHTML.on

    // append the tr with HTML for each trip to the tbody
    tripListElement.append($(tripHTML));
  }) // forEach

  // remove the css styling for the previously sorted th
  $('th.sort').removeClass('current-sort-field');

  // add css styling to the newly softed th
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
} // render

// function to show all the trips when the 'Explore our trips' button is clicked
const showAllTrips = function showAllTrips() {
  // get all the trips from the API
  // fetch will cause the update event to be triggered
  tripList.fetch();
  // Hide the button
  $(this).hide();
} // showAllTrips

// function to show the trip details when a tr is clicked on
const showTripDetails = function showTripDetails() {
  console.log('got into the showTripDetails function!');

  alert('in the showTripDetails function')
} // showTripDetails

// function to read the data from the add-trip-form
let readFormData = function readFormData() {
  let tripData = {};

  TRIP_FIELDS.forEach((field) => {
    let inputElement = $(`#add-trip-form input[name="${field}"]`);
    let value = inputElement.val();
    console.log(value);

    // don't allow empty strings
    if (value != '') {
      tripData[field] = value;
    } // if

    // clear the inputElement
    inputElement.val('');
  }) // forEach
  console.log("read the trip data");
  console.log(tripData);
  return tripData;

} // readFormData

// function to display validation failure error message
const handleValidationErrors = function handleValidationErrors(errors, nextFunction) {
  console.log('in handleValidationErrors');
  for (let field in errors) {
    if (nextFunction === 'top') {
      for (let problem of errors[field]) {
        reportStatus('error', `${field}: ${problem}`);
      } // for
    } else if (nextFunction === 'form') {
      for (let problem of errors[field]) {
        reserveStatus('error', `${field}: ${problem}`);
      } // for
    }// if else if
  }
} // handleValidationErrors

// function to add a trip
const addTripHandler = function(event) {
  event.preventDefault();


  const trip = new Trip(readFormData());

  console.log(`trip data:`);
  console.log(trip);

  // break out of the function if the trip is not valid
  if (!trip.isValid()) {
    console.log('in if for !trip.isValid');
    handleValidationErrors(trip.validationError, 'top');
    return;
  }

  trip.save({}, {
    success: (model, response) => {
      tripList.add(trip);
      console.log('The trip was saved!');
      console.log(`I can access the trip $(tripList.get(trip))`);
      reportStatus('success', 'Successfully saved trip!');
      $('#add-trip-form').remove();
      $('#add-trip').show();
    }, // success
    error: (model, response) => {
      console.log('failed to save the trip. Server response:');
      console.log(response);

      // remove the trip if it was not saved
      // tripList.remove(model);

      handleValidationErrors(response.responseJSON["resErrors"], 'top');
    },
  }) // book.save
} // addTripHandler

// clear status messages when you click the x button
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
} // clear status

// funtion to report statuses at the top of the page
const reportStatus = function reportStatus(status, message) {
  console.log(`reporting ${ status } status: ${ message }`);

  // make an object to pass to the template method
  let statusMessage = {status: status, message: message}

  // template method generates the li html for each message
  const statusHTML = statusTemplate(statusMessage);

  // note the symetry with clearStatus()
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();

} // reportStatus

// function to report status for the reserve trip form
const reserveStatus = function reserveStatus(status, message) {
  const statusObj = { status: status, message: message }

  const resStatusHtml = statusTemplate(statusObj);

  $('#form-status').append(resStatusHtml);
} // reserveStatus



$(document).ready(() => {
  // make the underscore function to list all the trips
  allTripsTemplate = _.template($('#display-trips').html());

  // underscore function to display the trip details
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // underscore function to get form to make a new trip
  tripFormTemplate = _.template($('#trip-form-template').html());


  // underscore template to show status messages
  statusTemplate = _.template($('#status-message-template').html());

  // get the trips from the api when the user clicks the 'Explore our trips!'.
  $('#get-trips').on('click', showAllTrips)

  // when we update tripList we will rerender the page
  tripList.on('update', render)

  // trigger render when the table is sorted
  tripList.on('sort', render);

  // click event to add a trip
  // keeping this all in the .ready for now so it is easier to refactor to add a modal later
  $('#add-trip').on('click', () => {
    let formHTML = tripFormTemplate();
    $('#place-for-form').append(formHTML);
    $('#add-trip').hide();

    // remove form when you hit the cancel button
    $('#cancel').on('click', (event) => {
      $('#add-trip-form').remove();
      $('#cancel').remove();
      $('#add-trip').show();
    }) // cancel.on

    // make the form go away when you submit the form
    $('#add-trip-form').on('submit', addTripHandler)
  }) // add-trip.on

  // click event to clear status messages
  $('#status-messages button.clear').on('click', clearStatus);

  // click handler to sort the table when one of the th is clicked on
  TRIP_FIELDS.forEach((field) => {
    // find th with the class sort and the field
    const headerElement = $(`th.sort.${field}`);

    //add a click event to each th
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);

      // change the comparator and then call sort
      // sort will trigger render
      tripList.comparator = field;
      tripList.sort();
    });
  }) // forEach

}); // .ready
