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

let statusMessagesTemplate;

// Clear status messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const fields = ['name', 'category', 'continent', 'weeks', 'cost'];

const updateStatusMessageFrom = (messageHash) => {
  $('#status-messages ul').empty();
  for(let messageType in messageHash) {
    messageHash[messageType].forEach((message) => {
      $('#status-messages ul').append($(`<li>${messageType}:  ${message}</li>`));
      console.log(`<li>${messageType}:  ${message}</li>`);
    })
  }
  $('#status-messages').show();
};

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${message}</li>`);
  $('#status-messages').show();
};

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

let successfullSave = function(model, response) {
  updateStatusMessageWith(`${model.get('name')} added!`)
};
let failedSave = function(model, response) {
  updateStatusMessageFrom(response.responseJSON.errors);
  model.destroy();
};

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

  if (trip.isValid()) {
      tripList.add(trip);
      trip.save({}, {
        success: successfullSave,
        error: failedSave,
      });
  } else {
      // getting here means there were client-side validation errors reported
      updateStatusMessageFrom(trip.validationError);
  }

  setTimeout(function(){ $('#status-messages').hide(); }, 10000);

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

  // reservation.save({}, {
  if (reservation.save) {
    $('#status-messages ul').empty();
    $('#status-messages ul').append($(`<li>${reservation.get('name')} successfully reserved for this trip!</li>`)).html();
  } else {
    $('#status-messages ul').empty();
    $('#status-messages ul').append($(`<li>Unable to complete reservation for ${reservation.get('name')}. Please try again.</li>`)).html();
  }

    // success: (model, response) => {
    //   console.log('Successfully saved reservation!');
    //   // $('#status-messages').html('Successfully saved reservation!');
    //   // updateStatusMessageWith(`${model.get('name')} has been reserved for this trip.`);
    //   successfullSave;
    // },
    // error: (model, response) => {
    //   console.log('Failed to save reservation! Server response:');
    //   console.log(response);
    //   // $('#status-messages').html('Failed to save reservation!');
    //   failedSave;
      // FIGURE OUT HOW TO ADD EACH ERROR
      //SET TIMEOUT ON THIS ONE AND THE SUCCESS - check TREK Project


};


$(document).ready(() => {

  // $('#reservation-form').hide()
  $('#all-trips').hide();
  $('#add-trip').hide();

  // ERROR AND SUCCESS MESSAGES
  statusMessagesTemplate = _.template($('#status-messages-template').html());



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

  $('#load-trips-button').on('click', function(event) {
    $('#all-trips').show();
    $('#add-trip').hide();
    $('#trip-detail').hide();
  });

  $('#add-trip-button').on('click', function(event) {
    $('#add-trip').show();
    $('#trip-detail').hide();
  });

  // Listen for when the user adds a trip
  $('#add-trip-form').on('submit', addTripHandler);
  $('#add-trip-form').on('submit', function(event) {
    $('#add-trip').hide();
  });

  // SINGLE TRIP TEMPLATE
  singleTripTemplate = _.template($('#single-trip-template').html());

  $('#trip-list').on('click', '.trip', function(event) {
    // alert($(this).data("id"));
    const trip = new Trip( {id: $(this).data("id") } );
    trip.on('change', renderSingleTrip);
    trip.fetch();
    $('#all-trips').hide();
    $('#add-trip').hide();
    // $('#trip-detail').hide('#reservation-form');
    $('#trip-detail').show();

  });

  $('#trip-detail').on('click', '#reservation-button', function(event) {
    $('#reservation-form').show();
    // $(document).scrollTo($('#reservation-form'), 1000);  ///THIS DID NOT WORK
    $('html, body').animate({
        scrollTop: $("#reservation-form").offset().top
    }, 2000);
  });


  $('#trip-detail').on('submit', '#reservation-form', function(event) {
    $('#reservation-form').hide();
  });

  $('#trip-detail').on('submit', '#reservation-form', addReservationHandler);

  $('#trip-filter-form').on('submit', function(event) {
    event.preventDefault();
  });

  $('#trip-filter').on('keyup', function(event) {

    //$ here is syntax used to indicate got this from jquery
    let $filter = $('#trips-filter'); //this is the form input element (search bar)
    let filteredTrips = tripList.select((trip) => {
      // $filter.val is the value of everything in the serach bar and trim takes out whitespace
      if ($filter.val().trim() === "") {
        return true;
        //if nothing has been typed in, select everything
      }

      let filterType = $('#filter-type').val();

      if (filterType === "continent" || filterType === "name" || filterType === "category" ) {
        return trip.get(filterType).toLowerCase().includes($filter.val().toLowerCase());
      }
      else {
        return trip.get(filterType) <= parseInt($filter.val());
      }
      // Can move this code into a method outside of doc.ready and then call it here and then call it also below for trip-filter.change
    });

    renderTrips(filteredTrips);
  });

  $('#trip-filter').on('change', function(event){
    $('#trip-filter').val("");
  })

  // $('#status-messages').hide().show('slow').html(generatedHTML);
  //       setTimeout(function(){ $('#status-messages').hide(); }, 10000);
  // $('#status-messages button.clear').on('click', clearStatus);
});


// $(document).ready( () => {
//   $('main').html('<h1>Hello World!</h1>');
// });
