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

  // trip.fetch({
  //   success: (model) => {
  //     const generatedHTML = $(detailsTemplate(trip.attributes));
  //     detailsElement.append(generatedHTML);
  //   }
  // });

  // API doesn't happen if model has already been clicked on and updated
  if (trip.get('about')) {
    const generatedHTML = $(detailsTemplate(trip.attributes));
    detailsElement.append(generatedHTML);
  } else {
    trip.fetch({
      success: (model) => {
        const generatedHTML = $(detailsTemplate(trip.attributes));
        detailsElement.append(generatedHTML);
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



$(document).ready( () => {
  detailsTemplate = _.template($('#details-template').html());
  tripTemplate = _.template($('#trip-template').html());

  // adding new models to a collection triggers an update event
  tripList.on('update', render);

  // get all of the trips from the API
  tripList.fetch();

  let myTrip = new Trip ({
    "continent":"Africa",
    "category":"everything",
    "weeks":5,
    "cost":9599.99
  });
  console.log(myTrip.isValid());
});
