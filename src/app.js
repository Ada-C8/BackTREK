// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';


import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';

const TRIP_FIELDS = ['id', 'name', 'continent', 'category', 'weeks', 'cost', 'about'];
const DISPLAY_TRIP_FIELDS = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();

// // Starts undefined - we'll set this in $(document).ready
// // once we know the template is available
let tripTemplate;

const renderTrips = function renderTrips(tripList) {
//   iterate through the tripList, generate HTML
//   for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });
  console.log('ran render');
  console.dir(tripList);

  // SORTING
  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${tripList.comparator}`).addClass('current-sort-field');
  // alert(`sorted by ${tripList.comparator}`);
};


let singleTripTemplate;

const renderSingleTrip = function renderSingleTrip(trip) {
  const tripElement = $('#trip-detail');
  const generatedHTML = singleTripTemplate(trip.attributes);
  tripElement.html(generatedHTML);

    console.log("checking this");
}


//ADDING A TRIP
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

  console.log("Read trip data");
  console.log(tripData);

  const trip = new Trip(tripData);

  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      tripList.add(model);
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
    },
  });
};

//ADDING A Reservation
const addReservationHandler = function(event) {
  event.preventDefault();
  const reservationData = {};
  ['name', 'email', 'age'].forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#reservation-form input[name="${ field }"]`);
    const value = inputElement.val();
    reservationData[field] = value;

    inputElement.val('');
  });

  console.log("Read Reservation data");
  console.log(reservationData);

  reservationData["trip_id"] = $(this).data("id");
  const reservation = new Reservation(reservationData);

  console.log(reservation.url);

  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved reservation!');
      $('#alert-messages').html('Successfully saved reservation!');
    },
    error: (model, response) => {
      console.log('Failed to save reservation! Server response:');
      console.log(response);
      $('#alert-messages').html('Failed to save reservation!');
      // FIGURE OUT HOW TO ADD EACH ERROR
      //SET TIMEOUT ON THIS ONE AND THE SUCCESS - check TREK Project
    },
  });
};


$(document).ready(() => {

  // $('#reservation-form').hide()

  tripTemplate = _.template($('#trip-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);

// Register our update listener first, to avoid the race condition
  tripList.on('update', renderTrips);
  tripList.on('sort', renderTrips);

// Fetch is what gets the data
// When fetch gets back from the API call, it will add trips
// to the list and then trigger an 'update' event
  tripList.fetch();

  console.log(tripList);

// Sort Trip List by Trip Fields
// Add a click handler for each of the table headers
//to sort the table by that column

  DISPLAY_TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });


  // Listen for when the user adds a trip
    $('#add-trip-form').on('submit', addTripHandler);


  // SINGLE TRIP TEMPLATE
  singleTripTemplate = _.template($('#single-trip-template').html());

  $('#trip-list').on('click', '.trip', function(event) {
    // alert($(this).data("id"));
    const trip = new Trip( {id: $(this).data("id") } );
    trip.on('change', renderSingleTrip);
    trip.fetch();

  });

  $('#trip-detail').on('submit', '#reservation-form', addReservationHandler);

  $('#reservation-button').on('click', function(event) {
    // $('#reservation-form').show();
    // console.log('attempting to show the reservation form');
    alert("Clikced button");
  });

  $('#trip-filter-form').on('submit', function(event) {
    event.preventDefault();
  });

  $('#trip-filter').on('keyup', function(event) {

    //$ here is syntax used to indicate got this from jquery
    let $filter = $(this);
    let filteredTrips = _.filter(tripList.models, (trip) => {
      let filterType = "continent";

      if (filterType === "continent" || filterType === "name" || filterType === "category" ) {
        return trip.get(filterType).toLowerCase().includes($filter.val().toLowerCase());
      }
      else {
        return trip.get(filterType) <= parseInt($filter.val());
      }
    });

    renderTrips(filteredTrips);
  });

});


// $(document).ready( () => {
//   $('main').html('<h1>Hello World!</h1>');
// });
