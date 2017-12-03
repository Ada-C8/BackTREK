// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

// models and collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';


const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'price'];

let allTripsTemplate;
let oneTripTemplate;

// Render Methods

const renderAll = function renderAll(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }` ).addClass('current-sort-field');

  tripList.on('update', renderAll);
  tripList.on('sort', renderAll);

  tripList.forEach((trip) => {
    // console.log(`Rendering trip ${ trip.get('name') }`);

    let tripsHTML = allTripsTemplate(trip.attributes);
    tripListElement.append( $(tripsHTML) );
    // append that HTML formatted data to the table body
  }); // for each
}; // renderAll function



const renderDetails = function renderDetails(id) {
  const tripDetails = $('#trip-details');
  // make the paragraph with id trip-details a jquery object and assign it to a variable
  tripDetails.empty();
  let oneTrip = new Trip({id: id});
  // clear the space if something is in it
  console.log("rendering one trip");
  let tripHTML = oneTripTemplate(oneTrip.attributes);
  tripDetails.append( $(tripHTML));
}; // renderDetails


$(document).ready( () => {

  allTripsTemplate = _.template($('#all-trips-template').html() ); //same for collections and models
  oneTripTemplate = _.template($('#show-details-template').html() );
  // Builds a collection
  const tripList = new TripList();
  // let oneTrip = new Trip();

  tripList.on('sort', renderAll);

  //Event handlers for buttons
  const allTrips = $('#load-trips');
  allTrips.on('click', () => {
    tripList.fetch();
    console.log("I fetched it!");
    // tripList.renderAll;
  })

  $('#testing').on('click', () => {
    console.log("test worked ");
  });

  $('.trips').on('click', () => {
    console.log("you did it ");
  });

  // $('#load-one-trip').on('click', 'tr', function() {
  //   console.log("you clicked something");
    // let oneTrip = new Trip({id: current_trip_id})
    // oneTrip.fetch();
    // console.log("Got it!")
  // });
  // $('#trip-list').on('click', 'tr', function() {
  //   $('.current-select-row').removeClass('current-select-row');
  //   const tripID = $(this).attr('data-id');
  //   $(this).addClass('current-select-row');
  //   events.showTrip(tripID);
  // });



  //Event handlers for table headers
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);

    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      tripList.comparator = field;
      tripList.sort();

    }); // click event handler
  }); // fields for each







}); // end document ready
