// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';

const tripList = new TripList();

const TRIP_FIELDS = ["id", "name", "continent", "category", "weeks", "cost"];

let tripTemplate;
let detailsTemplate;

const renderDetails = function renderDetails(trip){
  const detailsElement = $('#trip-details');
  detailsElement.html('');

  if (trip.get('about')) {
    const generatedHTML = $(detailsTemplate(trip.attributes));
    detailsElement.append(generatedHTML);
    // console.log(`my trip already has info`);
  } else {
    trip.fetch({
      success: (model) => {
        const generatedHTML = $(detailsTemplate(trip.attributes));
        detailsElement.append(generatedHTML);
        // console.log(trip);
      }
    });
  }
};

const render = function render(tripList) {
  // iterate through the bookList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');

  // clears the html so when we dynamically render again we get a new list vs just adding on
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', (event) => {
      renderDetails(trip);
    });
    tripTableElement.append(generatedHTML);
  });
};


// MODALS
// Get the modal
const modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

$(document).ready( () => {
  detailsTemplate = _.template($('#details-template').html());
  tripTemplate = _.template($('#trip-template').html());

  // adding new models to a collection triggers an update event
  tripList.on('update', render);

  // get all of the trips from the API
  tripList.fetch();

  // EVENTS
  // $('#add-book-form').on('submit', addBookHandler);

  // MODAL
  // changes modal class so that that is displays when add trip button is clicked on
  $('#add-trip-button').on('click', function() {
    modal.style.display = "block";
  });
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
