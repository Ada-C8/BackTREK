// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// do i need you? -- I THINK SO
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// ALL THE FIELDS
const TRIP_FIELDS = ['id', 'name', 'continent', 'about', 'category', 'weeks', 'cost'];

const tripList = new TripList();
let trip = new Trip();

let tripTemplate;
let tripDetails;

// RENDERS
const render = function render(tripList) {
  const tripTbody = $('#trip-list');
  tripTbody.html('');

  tripList.forEach((trip) => {
    const generatedHtml = tripTemplate(trip.attributes);
    tripTbody.append(generatedHtml);
  });
};

const renderDetails = function renderDetails(trip){
  const detailsDiv = $('#trip-details');
  detailsDiv.html('');

  console.log(trip.attributes);

  trip.fetch({
    success: (model) => {
      const generatedHTML = $(tripDetails(trip.attributes));
      detailsDiv.append(generatedHTML);
      console.log(trip);
    }
  });
};

// JQUERY
$(document).ready( () => {
  // my templates
  tripTemplate = _.template($('#trip-template').html());
  tripDetails = _.template($('#detail-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);

  tripList.on('update', render);
  tripList.fetch();

  trip.on('click', renderDetails);
  trip.fetch();

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      tripList.comparator = field;
      tripList.sort();
    })
  });
});

$('tbody#trip-list').on('click', 'a', function() {
  let tripID = $(this).attr('data-id');
  trip = tripList.get(tripID);
  console.log(trip);
  console.log(trip.attributes);
  trip.on('click', renderDetails(trip));
  // trip.fetch();
});

// $('tbody#trip-list').on('click', 'a', function() {
//   // where you will go
//   const tripDiv = $('#trip-details');
//   tripDiv.html('');
//
//   // who are you
//   let tripID = $(this).attr('data-id');
//   let thisTrip = new Trip({ id: `${tripID}` });
//   thisTrip.fetch();
//   // console.log(thisTrip);
//   // let tripInf = trip.fetch(tripID);
//   // console.log(tripList.models);
//   // let thisTrip = Trip.where({ id: `${tripID}` });
//   // console.log(thisTrip);
//   // let tripInf = tripList.where({ id: `${tripID}` });
//
//   // console.log(tripID);
//   // console.log(tripInf);
//   console.log(thisTrip);
//   console.log(thisTrip.attributes);
//   // console.log(thisTrip.attributes.get('name'));
//   console.log(thisTrip.attributes.name);
//   console.log(thisTrip.attributes['continent']);
//
//   // append that
//   const generatedHtml = $(tripDetails(thisTrip.attributes));
//   // const generatedHtml = tripDetails(thisTrip.attributes);
//   tripDiv.append(generatedHtml);
// });
