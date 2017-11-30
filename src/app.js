// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
// import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
console.log('it loaded!');

// const TRIP_FIELDS = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];
const tripList = new TripList();
// const trip = new Trip();

let tripsTemplate;

const render = function render(tripList){
  const tripsTableElement = $('#trip-list');
  $('thead').hide();

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
  }

  // const loadtrip = function loadtrip(){
  //   trip.fetch();
  //   trip.on('update', renderTrip, trip);
  // }


  $(document).ready(() => {
    tripsTemplate = _.template($('#trips-template').html());
    $('#trip-list').hide();
    $('#load').on('click', function(){
      $('#trip-list').show();
    });
    tripList.fetch();
    tripList.on('update',render);


  });
