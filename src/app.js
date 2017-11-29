// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip'
import TripList from './app/collections/trip_list'


console.log('it loaded!');

const newTrip = new Trip({
  name: "Here to There",
  continent: "Here",
  category: "There",
  duration: "4",
  cost: "45",
})

console.log(newTrip.get('name'));
console.log(newTrip.get('cost'));

let tripTemplate;

let individualTripTemplate;


const tripList = new TripList();

// render html for tripList
const render = function render(tripList) {
  //iterate through the tripList, generate HTML
  //for each model and attach it to the DOM
  const tripTableElement = $('#trip-list');
  //tripTableElement.html('')
  //will clear out previous list when you render again
  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    console.log(`In tripList forEach, trip.attributes: ${trip.attributes}`);
    tripTableElement.append(generatedHTML);
  })
  $('#trip-table').show();

  // $('.trip').on('click', function(event) {
  //   let tripId = $(this).attr('data-id');
  //
  //   console.log($(this).attr('data-id'));
  //   //get trip via tripId from tripList
  //   tripList.get(tripId).fetch();
  //
  //   console.log(tripList.get(tripId));
  // });

  $('.trip').on('click', function(event) {
    console.log('in the trip click');

    // get the id of the trip you clicked on
    let tripId = $(this).attr('data-id')
    // fetch the trip details of the trip you clicked on from the api; fetch returns a hash
    let trip = tripList.get(tripId)
      trip.fetch({
        success: function(model) {
          console.log(`in the fetch and about is: ${model.get('about')}`);
          console.log(`model attributes: ${model.get('attributes')}`);

          const individualtripListElement = $('#individual-trip-details');

          individualtripListElement.html(''); //will clear out previous list when you render again

          const generatedHTMLTripDetails = individualTripTemplate(model.attributes);
          individualtripListElement.append(generatedHTMLTripDetails);

          $('#individual-trip-details').show();

        //   const TRIP_DETAILS = ['name', 'continent', 'category', 'weeks', 'cost', 'about'];
        //
        //   TRIP_DETAILS.forEach((detail) => {
        //     individualTripTemplate(model.attributes)
        //   })
        //
        //   const generatedHTML = tripTemplate(trip.attributes);
        //   console.log(trip.attributes);
        //   tripTableElement.append(generatedHTML);
        // })
        // $('#trip-table').show();
        } // function
      }); // fetch
  })
}; //render


$(document).ready( () => {
  // compile templates for all trips and individual trips
  tripTemplate = _.template($('#trip-template').html());

  individualTripTemplate = _.template($('#individual-trip-template').html());

  // addTripFormTemplate = _.template($('#add-trip-form-template').html());

  // Register update listener first, to avoid the race condition
  tripList.on('update', render);

  // Listen for user click on add trip button
  $('#add-trip').on('click', function() {
    console.log('#add-trip clicked');
    // Make form available to user
    $('#add-trip-form').show();
  });

  // Listen for when user submits trip form
  // $('#add-trip').on('click', addBookHandler);
  // tripList.on('update', render);

  $('#all-trips').on('click', function() {
    console.log('#all-trip has been clicked, in event handler');
    // When fetch gets back from the API call, it will add books
    // to the list and then trigger an 'update' event
    tripList.fetch();
    console.log('#all-trip has been clicked, in event handler, after fetch()');
  });

});
