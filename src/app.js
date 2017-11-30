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

const render = function render(tripList) {
  // iterate through the bookList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
    $(`#trip${trip.attributes.id}`).on('click', (event) => {
      let tripDetails = new Trip({id: `${trip.attributes.id}`});
      console.log(tripDetails.url());
      // tripDetails.on('update', renderDetails);
      tripDetails.fetch({'success': renderDetails });
      // console.log(tripDetails);
      // renderDetails(tripDetails);
    });

  });
};

const renderDetails = function renderDetails(tripDetails){
  // tripDetails= new Trip();
  console.log('inside render deteails');
  console.log(tripDetails.attributes)


  const detailsElement = $('#oneTrip');
  console.log('found detailsElement?', detailsElement)
  detailsElement.html('');

  // const generatedHTML = $(detailsTemplate(tripDetails.attributes));
  const generatedHTML = detailsTemplate(tripDetails.attributes);
  console.log(generatedHTML);
  // console.log(tripDetails.attributes);
  detailsElement.append(generatedHTML);
};


let tripTemplate;
let detailsTemplate;

$(document).ready( () => {
  // When fetch gets back from the API call, it will add books
  // to the list and then trigger an 'update' event
  tripTemplate = _.template($('#trip-template').html());
  detailsTemplate = _.template($('#details-template').html());
  // console.log(`About to fetch data from ${ tripDetails.url() }`);

  // detailsTemplate = _.template($('#details-template').html());
  tripList.on('update', render);
  tripList.fetch();





  // tripDetails.fetch();
  // tripDetails.on()
});
