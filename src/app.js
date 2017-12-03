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

let tripTemplate;

//Methods

const renderAll = function renderAll(tripList) {
  const tripListElement = $('#trip-list');
  // make the table-body with id trip-list a jquery object & assign it to a variable
  tripListElement.empty();
  // clear the table-body with id trip-list

  // Apply styling to the current sort field
  $('th.sort').removeClass('current-sort-field');
  // remove class from all headings
  $(`th.sort.${ tripList.comparator }` ).addClass('current-sort-field');
  // add class when triggered

 // redraw the table
 // tripList.on('update', render);

 // redraw table by sort field
 tripList.on('sort', renderAll);

  tripList.forEach((trip) => {
    console.log(`Rendering trip ${ trip.get('name') }`);

    let tripsHTML = tripTemplate(trip.attributes);
    //use template to create filled in template using retrieved data
    tripListElement.append($(tripsHTML));
    // append that HTML formatted data to the table body
  }); // for each
}; // renderAll function

// const renderDetails = function renderDetails(trip){
//   const tripDetails = $('trip-details');
//   // make the paragraph with id trip-details a jquery object and assign it to a variable
//   tripDetails.empty();
//   // clear the space if something is in it
//   let tripHTML = $()
//     genhtml.on('click', (event) => {
//       renderDetails(trip);
//     }) //click event
//
//   tripDetails.append(tripHTML);
// }; // renderDetails funciton

// sort function




$(document).ready( () => {

  console.log('in document ready');

  tripTemplate = _.template($('#trip-template').html() ); //same for collections and models

  // Builds a collection
  const tripList = new TripList();

  // gets date from APi and triggers an Update Event
  // $('#load').on('click', )
  // tripList.fetch();

  // tripList.on('update', renderAll);
  tripList.on('sort', renderAll);
  //so the fetch will trigged update and then render will render the data into the template.
  $('.name').on('click', 'td', () => {
    console.log("you clicked something");
  })

  //Event handlers for buttons
  const allTrips = $('#load-trips');
  allTrips.on('click', () => {
    tripList.fetch();
    console.log("I fetched it!");
    // tripList.renderAll;
  })

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


  //
  //
  //
  // const tripHTML = tripTemplate(testTrip.attributes);
  // console.log(tripHTML);
  // $('#trip-list').append(tripHTML);
  //
  // practice data

  // const testTrip = new Trip({
  //     name: "Cairo",
  //     continent: "Africa",
  //     category: "everything",
  //     weeks: 5,
  //     cost: 9599.99
  //   });
  //
  // const testTripTwo = new Trip({
  //   name: "Place",
  //   continent: "Asia",
  //   category: "Fun",
  //   weeks: 2,
  //   cost: 1000.15
  // })



  //

  // const tripList = new TripList();
  // tripList.add(testTrip);
  // tripList.add(testTripTwo);
  //
  // console.log(tripList.at(0));
//
