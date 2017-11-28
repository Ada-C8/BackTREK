// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// modules I've created:
import TripList from './collections/trip_list';

const TRIP_FIELDS = ['name', 'category', 'continent', 'budget', 'weeks', 'description'];

const  tripList = new TripList();
let tripTemplate;
console.log('it loaded!');

const clearStatus = function clearStatus() {
  $('#status-messages ul').html();
  $('#status-messages').hide(); //how we hide this
};
const reportStatus = function reportStatus(status, message) {
  const statusHTML = `<li class="status${ status }">${ message }</li>`;
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show(); // now you're showing message
};


const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    console.log(`Rendering trip ${ trip.get('name') }`);
    const generatedHTML = tripTemplate(trip.attributes);
    tripListElement.append($(generatedHTML));
  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const addTripHandler = function(event) {
  event.preventDefault();
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#add-trip-form input[name=${ field }]`);
    const value = inputElement.val();
    tripData[field] = value;

    inputElement.val('');
  });
  console.log("read trip data");
  console.log(tripData);
  const trip = tripList.add(tripData);
  trip.save({}, {
    success: (model, response) => {
      console.log('successfully saved trip!');
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('failed to save trip.');
      console.log(response);
      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]){
          reportStatus('error', `${field}: ${problem}`);
        }
      }
    },
  });
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.on('update', render);


  tripList.on('sort', render);
  tripList.fetch();
  $('#add-trip-form').on('submit', addTripHandler);
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });
  $('#status-messages button.clear').on('click', clearStatus);
});
