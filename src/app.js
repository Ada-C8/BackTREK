// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import TripList from './app/collections/trip_list';

const tripList = new TripList();

const TRIP_FIELDS = ["id", "name", "continent", "category", "weeks", "cost"];

let tripTemplate;
let detailsTemplate;

const renderDetails = function renderDetails(trip){
  const detailsElement = $('#trip-details');

  // clears between clicks
  // api call is really slow
  trip.fetch({
    success: (model) => {
      console.log(model);
      const generatedHTML = $(detailsTemplate(trip.attributes));
      detailsElement.html('');
      detailsElement.append(generatedHTML);
    }
  });

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
      // console.log(`clicked on ${trip}`);
      //
      // console.log(trip);
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
});
