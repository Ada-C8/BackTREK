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

const TRIP_FIELDS = ["id", "about", "name", "continent", "category", "weeks", "cost"];

let tripTemplate;
let detailsTemplate;
let statusTemplate;

const renderDetails = function renderDetails(trip){
  const detailsElement = $('#trip-details');
  detailsElement.html('');

  if (trip.get('about')) {
    const generatedHTML = $(detailsTemplate(trip.attributes));
    detailsElement.append(generatedHTML);
    console.log(`Trip already has information available`);
  } else {
    trip.fetch({
      success: (model) => {
        const generatedHTML = $(detailsTemplate(trip.attributes));
        detailsElement.append(generatedHTML);
        console.log(trip);
        console.log(trip.attributes);
      }
    });
  }
};
