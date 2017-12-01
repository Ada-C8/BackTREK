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

console.log('it loaded!');

const clearStatus = function clearStatus() {
  $('#status-messages ul').html();
  $('#status-messages').hide(); //how we hide this
};
const reportStatus = function reportStatus(status, message) {
  const statusHTML = `<li class="status${ status }">${ message }</li>`;
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show(); // now you're showing message
};


const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    // console.log(`Rendering ${ trip.get('name') }`);
    const generatedHTML = tripTemplate(trip.attributes);
    tripListElement.append($(generatedHTML));

    // console.log(`Rendering trip *** ${ trip }`); //testing custom method toString()
  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');

  //// individual trip detail below /////
  $('.trip').on('click',function(event) {
    let tripId = $(this).attr('data-id');
    let trip = tripList.get(tripId)
    trip.fetch({
      success: function() {
        console.log(trip.attributes); // has the about
        const individualTripListElement = $('#individual-trip-detail');
        individualTripListElement.html('');

        const generatedHTMLTripDetails = individualTripTemplate(trip.attributes);

        individualTripListElement.append(generatedHTMLTripDetails);

        $('#individual-trip-detail').show();
        // handling reservation!
        $('#reserve').show(); //button display
        $('#reserve').on('click', function(event) {
          $('#add-reservation').show();
        });
        $('#add-reservation').on('submit', function(event){
          event.preventDefault();

          console.log('in submit event');
          let formData = $(this).serialize();
          const reservationResponse = function reservationResponse(status) {
            // console.log('inside res response');
            $("#messages").html(`<h3> ${status} </h3>`);
          };
          const positive = 'Resevation Made!';
          const success = function success(){
            $('#add-reservation').hide();
            reservationResponse(positive);
          };
          const negative = 'Reservation failed';
          let url = `https://ada-backtrek-api.herokuapp.com/trips/${ tripId }/reservations`;
          console.log(formData);
          $.post(url, formData, success)
          .fail(function(){
            console.log('failure');
            reservationResponse(negative);
          })
          .always(function(){
            console.log('always even if we have success or failure');
          });

        });
      }
    }); // fetch
  });
};

const readFormData = function readFormData() {
  const tripData = {};
  TRIP_FIELDS.forEAch((field) => {
    const inputElement = $(`#add-trip-form input[name=${ field }]`);
    const value = inputElement.val();
    if (value != '') { //dont take empty strings so that backbone can fill in default values
      tripDarta[field] = value;
    }
    inputElement.val('');
  });
  console.log("Read trip data");
  console.log(tripData);
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
  // const trip = tripList.add(readFormData);
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
  reserveTemplate = _.template($('#reserve-trip-template').html());

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
});
