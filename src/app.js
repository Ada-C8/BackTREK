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
  trip.fetch({
    success: (model) => {
      const generatedHTML = $(tripDetails(trip.attributes));
      detailsDiv.append(generatedHTML);
      console.log(trip);
    },
    error: (status, response) => {
      const errors = ($.parseJSON(response.responseText))['errors'];
    }
  });
  console.log(trip);
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

  // Show individual trip details
  $('tbody#trip-list').on('click', 'a', function() {
    let tripID = $(this).attr('data-id');
    trip = tripList.get(tripID);
    trip.on('click', renderDetails(trip));
  });

  // Listen for form submissions
  $('#add-trip-form').on('submit', (event) => {
    event.preventDefault();

    const tripData = readForm();
    const trip = tripList.add(tripData);
    console.log(tripData);
    console.log(trip);

    const newTrip = new Trip(formData);
    trip.save({}, {
      success: console.log("Success!"),
      error: console.log("Oh no!")
    });

  });


});
