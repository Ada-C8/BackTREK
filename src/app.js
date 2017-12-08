// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';
// import ContinentQuery from '.app/models/continent_query';

console.log('it loaded!');

let tripsTemplate;
let continentTemplate
let tripDescriptionTemplate;
let reserveFormTemplate;
let tripFormTemplate;


const tripList = new TripList();

// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];




// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalHide();
}
const modalDisplay = function modalDisplay(){
  $('.modal').addClass('show');
  $('.modal').removeClass('hidden');
  console.log('changed modal display to block')
};

const modalHide = function modalHide(){
  $('.modal').addClass('hidden');
  $('.modal').removeClass('show');
  console.log('changed modal display to hidden')
};

// $('.display-status').on('change', modalDisplay);


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modalHide()
  }
}
const queryContinent = function queryContinent(event){
  event.preventDefault();

}

const saveReservation = function saveReservation(event){
  event.preventDefault();
  console.log('saveReservation function');
  let tripNumberID = $('.list-upper-alpha').attr('id');
  let reservationObject = readFormData(reservationForm);

  let newReservation = new Reservation(reservationObject);
  newReservation.save({trip_id: tripNumberID}, {
    success: (model, response) => {
      const reservationSuccess = 'Successfully added reservation!'
      console.log(reservationSuccess);
      $('.display-status').html('')
      $('.display-status').html(response + reservationSuccess);
      modalDisplay();
    },
    error: (model, response) => {
      const reservationFailure = 'Failed to save reservation! Server response:';
      console.log(reservationFailure);
      console.log(response);
      $('.display-status').html('')
      $('.display-status').html(reservationFailure + response);
      modalDisplay();
      // handleValidationFailures(response.responseJSON["errors"]);
    },
  });
}

const displayError = function displayError(errorHash){

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
  if(!newTrip.isValid()){
    $('.display-status').html('')
    $('.display-status').html(`${newTrip.validationError}`);
    modalDisplay();
  }
  newTrip.save( {}, {
    success: (model, response) => {
      const tripSuccess = 'Successfully added Trip!';
      console.log(tripSuccess);
      $('.display-status').html('')
      console.log(response);
      $('.display-status').html(tripSuccess);
      $('#add-trip-form').remove();
      modalDisplay();
      // reportStatus('success', 'Successfully added reservation!');
    },
    error: (model, response) => {
      const tripFailure = 'Failed to save trip! Server response:';
      console.log(`validationError ${response.attributes['validationError']}`);
      $('.display-status').html('')
      console.log(response);
      $('.display-status').html(tripFailure);
      modalDisplay();
    },
  });
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
    if (value != ''){
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
  // let oneTrip = (tripList.first());
  // let size = 0, key;
  // for (key in oneTrip) {
  //   if (oneTrip.hasOwnProperty(key)) size++;
  // }
  //
  // console.log(size);
  // console.log('trip length');
  // console.log('triplist length');
  const tripTableElement = $('#trips-list');
  const continentTableElement = $('#continent-list');
  tripTableElement.html('');
  continentTableElement.html('');
  tripList.forEach((trip) => {
    if($('#trip-table').hasClass('show')){
      const generatedHTML = $(tripsTemplate(trip.attributes));
      tripTableElement.append(generatedHTML);
      generatedHTML.on('click', (event) =>{
        renderTripDetails(trip);
      })
    } else{
      const generatedContinentHTML = $(continentTemplate(trip.attributes));
      continentTableElement.append(generatedContinentHTML);
      generatedContinentHTML.on('click', (event) =>{
        renderTripDetails(trip);
      })
    };
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
  continentTemplate = _.template($('#continent-template').html());

  // tripList.fetch();
  $('.sort').on('click', sortTrips);
  console.log(renderReserveForm);
  // $('#reserve-button').on('click', renderReserveForm);
  tripList.on('update', renderTrips);
  tripList.on('sort', renderTrips);

  $('.continent-dropbtn').on('click', function(){
    $("#continent-dropdown").slideToggle( "slow", function() {
      // Animation complete.
    });
  });// end  function

  $('.cost-dropbtn').on('click', function(){
    $("#cost-dropdown").slideToggle( "slow", function() {
      // Animation complete.
    });
  });// end  function
  // $("#continent-dropdown").on('click', 'option', function(){
  //   $('#trip-table').addClass('hidden');
  //   $('#trip-table').removeClass('show');
  //   $('#continent-table').removeClass('hidden');
  //   $('#continent-table').addClass('show');
  //   tripList.fetchContinent({
  //     myValue: $(this).attr('value'),
  //     success: function(myValue){}
  //   });
  // });

  $("#continent-dropdown, #cost-dropdown").on('click', 'option', function(){
    console.log($(this).attr('id'));
    let queryUrlSnippet;
    let parentElement = $(this).parent();
    if ($(parentElement).attr('id') === 'continent-dropdown'){
      queryUrlSnippet = 'continent';
    }else{
      queryUrlSnippet = 'cost';
    }
    // console.log(queryUrlSnippet);
    console.log('that is queryUrlSnippet')
    $('#trip-table').addClass('hidden');
    $('#trip-table').removeClass('show');
    $('#continent-table').removeClass('hidden');
    $('#continent-table').addClass('show');
    tripList.fetchContinent({
      queryType: queryUrlSnippet,
      myValue: $(this).attr('value'),
      success: function(myValue){}
    });
  });

  // $("#cost-dropdown").on('click', 'option', function(){
  //   $('#trip-table').addClass('hidden');
  //   $('#trip-table').removeClass('show');
  //   $('#continent-table').removeClass('hidden');
  //   $('#continent-table').addClass('show');
  //   tripList.fetchContinent({
  //     queryType: 'cost',
  //     myValue: $(this).attr('value'),
  //     success: function(myValue){}
  //   });
  // });


  $('#add-trip').on('click', renderTripForm);
  $('#view-all-trips').on('click', function(){
    $('#trip-table').addClass('show');
    $('#trip-table').removeClass('hidden');
    $('#continent-table').removeClass('show');
    $('#continent-table').addClass('hidden');
    tripList.fetch({
      success: function(collection, response){}
    });
  });
});
