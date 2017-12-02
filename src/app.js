// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';

console.log('it loaded!');

let tripsTemplate;
let tripDescriptionTemplate;
let reserveFormTemplate;
let tripFormTemplate;

const tripList = new TripList();

// function myFunction() {
//   $(".myDropdown").toggle("show");
// }
//
// // Close the dropdown if the user clicks outside of it
// const dropDown = function dropDown(){
//   // let dropdowns = document.getElementsByClassName("dropdown-content");
//   let dropdowns = $(".dropdown-content");
//   let i;
//   for (i = 0; i < dropdowns.length; i++) {
//     let openDropdown = dropdowns[i];
//     if (openDropdown.classList.contains('show')) {
//       openDropdown.classList.remove('show');
//     }
//   }
// }
//
//
//   }
// }

const saveReservation = function saveReservation(event){
  event.preventDefault();
  let tripNumberID = $('.list-upper-alpha').attr('id');
  let reservationObject = readFormData(reservationForm);

  let newReservation = new Reservation(reservationObject);
  newReservation.save({trip_id: tripNumberID}), {
    success: (model, response) => {
      console.log('Successfully added reservation!');
      // reportStatus('success', 'Successfully added reservation!');
    },
    error: (model, response) => {
      console.log('Failed to save reservation! Server response:');
      console.log(response);
      // handleValidationFailures(response.responseJSON["errors"]);
    },
  };
}


const saveTrip = function saveTrip(event){
  event.preventDefault();

  let newTripObject = readFormData(addTripForm);
  // reservationObject['id'] = reservationID

  console.log(newTripObject);
  let newTrip = new Trip(newTripObject);
  console.log('bologna');
  console.log(newTrip);
  console.log(`this is ${this}`);
  newTrip.save({}), {
    success: (model, response) => {
      console.log('Successfully added Trip!');
      // reportStatus('success', 'Successfully added reservation!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      // handleValidationFailures(response.responseJSON["errors"]);
    },
  };
}
const reservationForm = {
  fields: ['name', 'age', 'email'],
  formId: 'add-reservation-form',
};

// add some more stuff to this form data
const addTripForm = {
  fields: ['name', 'continent', 'weeks', 'category', 'about', 'cost'],
  formId: 'add-trip-form',
};

const readFormData = function readFormData(formType) {
  const formData = {};
  (formType.fields).forEach((field) => {
    // select the input corresponding to the field we want
    let jQueryString = "#" + `${formType.formId} [name="${ field }"]`;
    const inputElement = $(jQueryString);
    const value = inputElement.val();
    console.log(`value is ${value}`);


    // Don't take empty strings, so that Backbone can
    // fill in default values
    if (value != '') {
      formData[field] = value;
    }

    inputElement.val('');
  });

  console.log(formData);

  return formData;
};
const formDivElement = $('#hidden-form');

const renderTripForm = function rendertripForm() {

  formDivElement.html('');

  console.log(' about to fetch form')


  const tripFormHTML = $(tripFormTemplate());
  console.log(`this is tripformhtml ${tripFormHTML}`)
  $("#reserve-button").remove();
  formDivElement.append(tripFormHTML);
  $('#add-trip-form').on('submit', saveTrip);
};

const renderReserveForm = function renderReserveForm() {

  formDivElement.html('');

  console.log(' about to fetch form')


  const reserveFormHTML = $(reserveFormTemplate());
  console.log(`this is reserveformhtml ${reserveFormHTML}`)
  $("#reserve-button").remove();
  formDivElement.append(reserveFormHTML);
  $('#add-reservation-form').on('submit', saveReservation);

};

const renderTrips = function renderTrips(tripList) {

  const tripTableElement = $('#trips-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    tripTableElement.append(generatedHTML);
    generatedHTML.on('click', (event) =>{
      renderTripDetails(trip);
    });
  });

  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};


const renderTripDetails = function renderTripDetails(trip) {

  const tripDivElement = $('#trip-details');
  formDivElement.html('');
  tripDivElement.html('');
  trip.fetch({
    success: (model) => {
      const detailsHTML = $(tripDescriptionTemplate(trip.attributes));
      tripDivElement.append(detailsHTML);
      $('#reserve-button').on('click', renderReserveForm);
      $("#add-reservation-form").remove();
    }
  });

  console.log(trip);
  console.log($(this).attr('class'));
};

const sortTrips = function sortTrips(){
  let sortCategory = $(this).attr('class').split(' ')[1];
  tripList.comparator = sortCategory;
  tripList.sort();
  console.log('sorted');
};

const singleTrip = function singleTrip(tripId){
  console.log(`tripId is ${tripId}`)
  let singleTripVar = tripList.findWhere({id: tripId});
  console.log(singleTripVar);
};

// const renderAllTrips = function
$(document).ready( () => {
  tripsTemplate = _.template($('#trips-template').html());
  tripDescriptionTemplate = _.template($('#trips-description-template').html());
  reserveFormTemplate = _.template($('#reserve-trip-form-template').html());
  tripFormTemplate = _.template($('#add-trip-form-template').html());

  // tripList.fetch();
  $('.sort').on('click', sortTrips);
  console.log(renderReserveForm);
  // $('#reserve-button').on('click', renderReserveForm);
  tripList.on('update', renderTrips);
  tripList.on('sort', renderTrips);

  $('.dropbtn').on('click', function(){

    $( "#myDropdown" ).slideToggle( "slow", function() {
      // Animation complete.
    });
  });// end  function

  $('#add-trip').on('click', renderTripForm);
  $('#view-all-trips').on('click', function(){
    tripList.fetch({
      success: function(collection, response){}
    });
  });
});
