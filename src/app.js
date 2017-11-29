// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// collections
import TripList from 'app/collections/trip_list';


// create the tripList to store the trips we access from the API
const tripList = new TripList();

// define the underscore templates at a global level so we can access it in the render function and other functions
let allTripsTemplate;
let tripDetailsTemplate;
// funtion to generate the html for the trip details
const renderDetailsHtml = (model) => {
  // generate the HTML for the trip details
  let detailsHTML = tripDetailsTemplate(model.attributes)
  console.log(detailsHTML);

  // prepend the trip detail inside the trip-details article. Need to change classes as well to make foundation styling work
  $('#trip-table').addClass("large-5 column")
  $('#trip-details').addClass("large-5 column");
  $('#trip-details').empty();
  $('#trip-details').prepend(detailsHTML);

  // TODO: add an error function!

  // I need to define the click function for hide-trip details within the function that generates the html for the button
  $('#hide-details').on('click', hideDetails)

} // renderDetailsHtml

// function to show trip details
const renderDetails = (trip) => {
  console.log('in the renderDetails function');

  // get the id of the trip you clicked on
  let tripId = trip.get('id')

  // fetch the trip details of the trip you clicked on from the api
  // the new attributes fetch sets for the model need to be access in a callback function
  let currentTrip = tripList.get(tripId)

  // if we havn't already done an api call to updage the currentTrips attributes to have 'about' then do an api call, if not then just make the trip details from the attribute the currentTrip allready has access to! 
  if (!currentTrip.get('about')) {
    currentTrip.fetch({
      success: function(model) {
        renderDetailsHtml(model);
      } // function
    }); // fetch
  } else {
    console.log('in the else! ');
    renderDetailsHtml(trip);
  }// if/else the currentTrip already has the about attribute
}

// function to hide the trip details
const hideDetails = function hideDetails() {
  $('#trip-details').empty();
  $('#trip-table').removeClass("large-5 column")
  $('#trip-details').removeClass("large-5 column");
}

// define a render function to call when tripList is updated or sorted
const render = function render(tripList) {
  // select the tbody element to append to
  const tripListElement = $('#trip-list')

  // empty the tbody before rendering
  tripListElement.empty();

  // make a tr for each trip
  tripList.forEach((trip) => {
    // use the underscore function to generate HTML for each trip
    let tripHTML = $(allTripsTemplate(trip.attributes));

    // add an event handler to each tr as it is created
    tripHTML.on('click', (event) => {
      renderDetails(trip);
    }) // tripHTML.on

    // append the tr with HTML for each trip to the tbody
    tripListElement.append($(tripHTML));
  }) // forEach
} // render

// function to show all the trips when the 'Explore our trips' button is clicked
const showAllTrips = function showAllTrips() {
  // get all the trips from the API
  // fetch will cause the update event to be triggered
  tripList.fetch();
  // Hide the button
  $(this).hide();
} // showAllTrips

// function to show the trip details when a tr is clicked on
const showTripDetails = function showTripDetails() {
  console.log('got into the showTripDetails function!');

  alert('in the showTripDetails function')
} // showTripDetails

$(document).ready(() => {
  // make the underscore function to list all the trips
  allTripsTemplate = _.template($('#display-trips').html());

  // underscore function to display the trip details
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // get the trips from the api when the user clicks the 'Explore our trips!'.
  $('#get-trips').on('click', showAllTrips)

  // when we update tripList we will rerender the page
  tripList.on('update', render)


}); // .ready
