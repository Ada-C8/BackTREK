// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

// models and collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';


const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'price'];

let allTripsTemplate;
let showDetailsTemplate;

// Render Methods

const renderAll = function renderAll(tripList) {
  const tripListElement = $('#trips-list');
  tripListElement.empty();
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }` ).addClass('current-sort-field');

  tripList.on('update', renderAll);
  tripList.on('sort', renderAll);

  tripList.forEach((trip) => {
    let tripsHTML = allTripsTemplate(trip.attributes);
    tripListElement.append( $(tripsHTML) );
  }); // for each
}; // renderAll function

const sampleHandler = (event) => {
  console.log("this is just a test");
  console.log(event);
}


const renderDetails = function renderDetails(id) {
  console.log("in the render and the id is");
  console.log(id);
  const tripDetails = $('#trip-details');
  tripDetails.empty();
  console.log("rendering one trip");
  const oneTrip = new Trip({id: id});
  console.log(oneTrip);
  oneTrip.fetch({}).done(() => {
    tripDetails.append(showDetailsTemplate(oneTrip.attributes));
  });
  console.log(oneTrip);
  // oneTrip.on('change', renderDetails);

  // let tripHTML = showDetailsTemplate(oneTrip.attributes);
  // tripDetails.append( $(tripHTML));
}; // renderDetails



$(document).ready( () => {

  allTripsTemplate = _.template($('#all-trips-template').html() );
  showDetailsTemplate = _.template($('#show-details-template').html() );

  const tripList = new TripList();
  // let oneTrip = new Trip();

  tripList.on('sort', renderAll);


//
// model.on('change', this.render, this) or model.on({change: this.render}, this)
  //Event handlers for buttons
  $('#trips-list').on('click', '.trips', (event) => {
    console.log("you did it ");
    console.log(event.target);
    const tripID = $(event.target).attr('data-id');
    console.log(tripID);
    console.log("about to render details");
    renderDetails(tripID);
  });


  const allTrips = $('#load-trips');
  allTrips.on('click', () => {
    tripList.fetch();
    console.log("I fetched it!");
    // tripList.renderAll;
  })

  $('#testing').on('click', sampleHandler);



  //Event handlers for table headers
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);

    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      tripList.comparator = field;
      tripList.sort();

    }); // click event handler
  }); // fields for each







}); // end document ready
