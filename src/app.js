// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
// import './backTrek.jpg';
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

// console.log('it loaded!');

const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost']

const RESERVE_FIELDS = ['name', 'age', 'email', 'tripId'];


//////////////////////////////////////////////////////////////
//////////////////////// ALL TRIPS ///////////////////////////
//////////////////////////////////////////////////////////////

// Create a new collection of all trips
const tripList = new TripList();

// Create a template for all trips to append to the page
const listTemplate = _.template($('#trip-template').html());

// Render all trips
const renderList = function renderList() {
  $('#trip-list').html('');
  tripList.forEach((trip) => {
    let generatedHtml = listTemplate(trip.attributes);
    $('#trip-list').append(generatedHtml);
    $(`#trip${ trip.id }`).click(function() {
      getTrip(trip.id);
      // let singleTrip = tripList.findWhere({id: tripID});
    });
  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};


////////////////////////////////////////////////////////////////
//////////////////////// SINGLE TRIP ///////////////////////////
////////////////////////////////////////////////////////////////

const singleTripTemplate = _.template($('#trip-info-template').html());

// Get one Trip
const getTrip = function getTrip(tripID) {
  $('#create-trip-form').hide();
  $('#trip-info').html('');
  let singleTrip = tripList.findWhere({id: tripID});
  singleTrip.fetch({
    success: (model, response) => {
      console.log('Model: ' + singleTrip.parse(model));
      console.log('Response: ' + response);
      showTrip(model);
    },
  });
};

// Render One Trip
const showTrip = function showTrip(trip) {
  let generatedHtml = singleTripTemplate(trip.attributes);
  $('#trip-info').html('');
  $('#trip-info').append(generatedHtml);
  $('#reserve-form').on('submit', (event) => {
    event.preventDefault();
    reserveTripHandler();
  });
};

//////////////////////////////////////////////////////////////
//////////////////////// CREATE TRIP /////////////////////////
//////////////////////////////////////////////////////////////

const newTripHandler = () => {
  let tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#new-trip-form input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;
  });

  let newTrip = new Trip(tripData);

  if (!newTrip.isValid()) {
    displayErrors(newTrip.validationError);
    return;
  }

  newTrip.save({}, {
    success: (model, response) => {
      tripList.add(model);
    },
    error: (model, response) => {
      console.log(response);
    },
  });
};

/////////////////////////////////////////////////////////////////
//////////////////////// RESERVE TRIP ///////////////////////////
/////////////////////////////////////////////////////////////////

const reserveTripHandler = () => {
  let reservation = {};
  RESERVE_FIELDS.forEach((field) => {
    const inputElement = $(`#reserve-form [name="${ field }"]`);
    const value = inputElement.val();

    reservation[field] = value;

    inputElement.val('');
  });

  let newReservation = new Reservation(reservation);

  // If it is valid it will return false
  if (!newReservation.isValid()) {

    // Returns the last value of the last failed validation - errors hash
    displayErrors(newReservation.validationError);
    return;
  }

  // Save as a post method to the API
  newReservation.save({}, {
    success: (model, response) => {
      // TODO: A popup to show that the resevation has been saved
      console.log('Your reservation has been saved!');
      // $('#reserve-form').reset();
    },
    error: (model, response) => {
      console.log(response);
    },
  });
};

/////////////////////////////////////////////////////////////////
//////////////////////// DISPLAY ERRORS /////////////////////////
/////////////////////////////////////////////////////////////////

const errorTemplate = _.template($('#error-template').html());

// Now I need to display the template and then append it to the place that i want to append it to
const displayErrors = (errors) => {
  $('#display-errors').empty();

  let errorObject = {};
  for (let key in errors) {
    errorObject[key] = errors[key];
  }

  let generatedHtml = errorTemplate(errorObject);
  $('#display-errors').append(generatedHtml);
  $('.close-button').on('click', (event) => {
    $('#display-errors').empty();
  });
};

/////////////////////////////////////////////////////////////////
////////////////////////////// SORT /////////////////////////////
/////////////////////////////////////////////////////////////////

const SORT_FIELDS = ['id', 'name', 'continent', 'about', 'category', 'weeks', 'cost']

// Attach sorting click handlers
const sortingHandler = () => {
  SORT_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);
    console.log(field);
    // Attaching an event handler here for the .on function for each of the header elements
    headerElement.on('click', (event) => {
      // Comparator is a property
      tripList.comparator = field;
      // If you don't change the comparator it will resort based on the sort not the comparator
      tripList.sort();
      // console.log('HITS SORT FUNCTION');
    });
  });
};



/////////////////////////////////////////////////////////////////
//////////////////////////// FILTER /////////////////////////////
/////////////////////////////////////////////////////////////////

const filterDropdown = () => {
  let value = $("#filter")[0].selectedIndex;
  return value;
}

const filterResults = () => {
  let input, filter, table, tr, td, i;
  input = $('#search-bar')[0];
  filter = input.value.toUpperCase();
  table = $('#all-trips')[0];
  tr = table.getElementsByTagName('tr');

  // Run this function to get the current value of the selected index
  let index = filterDropdown();
  // console.log("Value of the index: " + index);
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[index];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  };
};

/////////////////////////////////////////////////////////////////
///////////////////////// DOCUMENT READY ////////////////////////
/////////////////////////////////////////////////////////////////


$(document).ready(() => {

  $('#create-trip-form').hide();
  tripList.fetch();

  // Listen and register. Once an update has been heard, render all the collection into the template
  tripList.on('update', renderList);

  // RENDER CREATE TRIP FORM
  $('#create-trip').on('click', (event) => {
    $('#trip-info').html('');
    $('#create-trip-form').show();
  });

  // RENDER NEW TRIP FORM
  $('#new-trip-form').on('submit', (event) => {
    event.preventDefault();
    newTripHandler();
  });

  // RUNS SORTING METHOD
  sortingHandler();

  // ON SORT, RENDER ORGANIZED TRIP LIST
  tripList.on('sort', renderList);

  $('#search-bar').on('keyup', filterResults);

}); // DOCUMENT READY
