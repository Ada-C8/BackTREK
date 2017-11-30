// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';


import TripList from './app/collections/trip_list';
import Trip from './app/models/trip'
import Reservation from './app/models/reservation'

const TRIP_FIELDS = ['name', 'continent', 'weeks', 'category', 'about', 'cost'];

const RESERVATION_FIELDS = ['name', 'email', 'tripId']

const tripList = new TripList();

let tripTemplate;
let aboutTemplate;

const loadTrip = function loadTrip(singleTrip) {
  const aboutTableElement = $('#about');
  const thisTrip = singleTrip.fetch({
    success: (model) => {
      console.log(model);
      const generatedHTML = aboutTemplate(model.attributes)
      aboutTableElement.html('')
      aboutTableElement.append(generatedHTML);
      $('#add-reservation-form').on('submit', addReservationHandler);
    }});


    // console.log(singleTrip[0].attributes)
    // const singleTrip = tripList.fetch(event.currentTarget.id)

    // NOT CURRENTLY WORKING BC I HAVE TO SEND REQUEST TO URL TRIPS/ID
  };

  const loadTrips = function loadTrips(tripList) {
    const tripTableElement = $('#trip-list');
    tripTableElement.html('');

    tripList.forEach((trip) => {
      const generatedHTML = $(tripTemplate(trip.attributes));
      generatedHTML.on('click', (event) => {
        $('.trip').removeClass('selected-trip')
        generatedHTML.addClass('selected-trip')
        loadTrip(trip)
      })
      tripTableElement.append(generatedHTML);
    });

    $('th.sort').removeClass('current-sort-field');
    $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
  };

  const addReservationHandler = function(event) {
    event.preventDefault();
    console.log('in addreservation handler');

    const reservation = new Reservation(readReservationData());

    reservation.save({}, {
      success: (model, response) => {
        console.log('Successfully saved reservation!');
        // console.log(trip);
        // tripList.add(trip);
        // $('#status-messages').addClass('success')
        // $('#status-messages').html('SUCCESSFULLY SAVED!')
        //
        // reportStatus('success', 'Successfully saved trip!');
      },
      error: (model, response) => {
        console.log('Failed to save reservation! Server response:');
        //NEED TO FIND A WAY TO
        // $('#status-messages').addClass('failure')
        // $('#status-messages').append(`Failed to save trip`)
        // console.log(response);
        // tripList.remove(model)
        //
        // handleValidationFailures(response.responseJSON["errors"]);
      },

    });
  };

  const readReservationData = function readReservationData() {
    console.log('in reservation data');
    const reservationData = {};
    RESERVATION_FIELDS.forEach((field) => {

      const inputElement = $(`#add-reservation-form input[name="${ field }"]`);
      const value = inputElement.val();

      if (value != '') {
        reservationData[field] = value;
      }

      inputElement.val('');
    });
    console.log(reservationData);

    return reservationData;
  }

  const readFormData = function readFormData() {
    const tripData = {};

    TRIP_FIELDS.forEach((field) => {
      // select the input corresponding to the field we want
      const inputElement = $(`#add-trip-form input[name="${ field }"]`);
      const value = inputElement.val();

      if (value != '') {
        tripData[field] = value;
      }

      inputElement.val('');
    });

    return tripData;
  };

  const reportStatus = function reportStatus(status, message) {
    console.log(`Reporting ${ status } status: ${ message }`);

    // Should probably use an Underscore template here.
    const statusHTML = `<p class="${ status }">${ message }</p>`;

    // note the symetry with clearStatus()
    $('#status-messages').append(statusHTML);
    $('#status-messages').show();
  };

  const handleValidationFailures = function handleValidationFailures(errors) {
    // Since these errors come from a Rails server, the strucutre of our
    // error handling looks very similar to what we did in Rails.
    console.log('inhandlevalidationfaiilurs');
    for (let field in errors) {
      for (let problem of errors[field]) {
        reportStatus('error', `${field}: ${problem}`);
      }
    }
  };

  const addTripHandler = function(event) {
    event.preventDefault();
    console.log('in addtriphandler');

    const trip = new Trip(readFormData());

    if (!trip.isValid()) {
      handleValidationFailures(trip.validationError);
      return;
    }
    console.log('about to add!');
    console.log(trip);
    trip.save({}, {
      success: (model, response) => {
        console.log('Successfully saved trip!');
        console.log(trip);
        tripList.add(trip);
        $('#status-messages').addClass('success')
        $('#status-messages').html('SUCCESSFULLY SAVED!')

        reportStatus('success', 'Successfully saved trip!');
      },
      error: (model, response) => {
        console.log('Failed to save trip! Server response:');
        //NEED TO FIND A WAY TO
        $('#status-messages').addClass('failure')
        $('#status-messages').append(`Failed to save trip`)
        console.log(response);
        tripList.remove(model)

        handleValidationFailures(response.responseJSON["errors"]);
      },
    });

  };



  $(document).ready(() => {
    tripTemplate = _.template($('#trip-template').html());
    aboutTemplate = _.template($('#about-template').html());

    // $("#add-trip-form").hide()
    // $('#add-trip').on('click', function() {
    //   $("#add-trip-form").show('slow')
    // })

    tripList.on('update', loadTrips);
    tripList.on('sort', loadTrips);

    tripList.fetch();

    $('#add-trip-form').on('submit', addTripHandler);


    TRIP_FIELDS.forEach((field) => {
      const headerElement = $(`th.sort.${ field }`);
      headerElement.on('click', (event) => {
        console.log(`Sorting table by ${ field }`);
        tripList.comparator = field;
        tripList.sort();
      });
    });
    $('th.sort').removeClass('current-sort-field');
    $(`th.sort.${tripList.comparator }`).addClass('current-sort-field');


    // Get the modal
    const modal = document.getElementById('myModal');
    console.log(modal);
    // Get the button that opens the modal
    const btn = document.getElementById("add-trip");
    console.log(btn);

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
      console.log('inside onclick');
      $(modal).removeClass('none');
      $(modal).addClass('block');
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      $(modal).removeClass('block');
      $(modal).addClass('none');
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        $(modal).removeClass('block');
        $(modal).addClass('none');
      }
    }


  });
