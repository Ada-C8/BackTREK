// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
console.log('it loaded!');

const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

let tripsTemplate;

const render = function render(tripList){
  const tripsTableElement = $('#trip-list');
  tripsTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    generatedHTML.on('click',(event) => {
      renderTrip(trip)
      $('#trips').hide();
      $('#trip').show();
    }); //.on
    tripsTableElement.append(generatedHTML);
  }); //tripList
};  // render


  const renderTrip = function render(trip){
    const tripTableElement = $('#trip');
    tripTableElement.html('');

    const generatedHTML = $(tripsTemplate(trip.attributes));
    tripTableElement.html(generatedHTML);
  };


  $(document).ready(() => {
    tripsTemplate = _.template($('#trips-template').html());
    const tripList = new TripList();
    tripList.on('update',render);
    $('#load').on('click', function(){
      $('#trip-list').show();
      tripList.fetch({
        success: function(){
          $('#trips').show();
        }
      });
    });

    // tripTemplate = _.template($('#trip-template').html());
    // const loadtrip = function loadtrip(){
    //   trip.fetch();
    //   trip.on('update', renderTrip, trip);
    // }

    $("#add-trip-form").on('submit', function(event){
      event.preventDefault(); // stops after reading user input, doesn't do anything yet
      let tripData = {};

      TRIP_FIELDS.forEach((field) => {
        tripData[field] = $(`#add-trip-form input[name="${field}"]`).val();
      });

      let trip = new Trip(tripData);

      trip.save({}, {
        success: function(model, response){
          tripList.add(model);
        }
      });

    });
  });
