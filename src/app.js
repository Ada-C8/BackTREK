// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

import TripList from './app/collections/trip_list';

import Trip from './app/models/trip';

const tripList = new TripList();
const tripDetails = new Trip();

const render = function render(tripList) {
  // iterate through the bookList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  })};

  const renderDetails = function renderDetails(oneTrip){
    const detailsElemet = $('#details-template');
    detailsElemet.html('');

    const generatedHTML = detailsTemplate(tripDetails.attributes);
    detailsElemet.append(generatedHTML);
  };


  let tripTemplate;
  let detailsTemplate;

  $(document).ready( () => {
    // When fetch gets back from the API call, it will add books
    // to the list and then trigger an 'update' event
    tripTemplate = _.template($('#trip-template').html());
    console.log(`About to fetch data from ${ tripDetails.url }`);

    // detailsTemplate = _.template($('#details-template').html());
    tripList.on('update', render);
    tripList.fetch();
  });
