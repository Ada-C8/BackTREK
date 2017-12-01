// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';


console.log('it loaded!');

const tripList = new TripList();
let tripTemplate;
let detailTemplate;

const fields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

console.log(tripList);

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    console.log(`Rendering trip ${trip.get('name')}`);
    let tripHTML = tripTemplate(trip.attributes);
    tripListElement.append($(tripHTML));
  });
};


// =================================================================

const getIndividualTrip = function getIndividualTrip() {
  console.log('*****************');
  console.log(this);
  console.log('*****************');

  // const tripDetails = $('#trip-list');
  const id = $(this).attr('id');
  let trip = tripList.get(id);
  trip.fetch();

  console.log('*****************');
  console.log(trip);
  console.log('*****************');
  // console.log(trip.attributes);
  // console.log(detailTemplate(trip.attributes));
  // $('#trip-details').append(detailTemplate({
  //   'name': 'n',
  //   'category': 'c',
  //   'continent': 'co',
  //   'weeks': 'w',
  //   'cost': 'c',
  //   'about': 'a'
  // }));

  let details = trip.attributes;
  // WHHHHAAAAAAATTT
  details.about = 'fake about';
  console.log(details.name);
  console.log(details.continent);
  console.log(details.about);

  $('#trip-details').empty();
  $('#trip-details').append(detailTemplate(details));
};

// =================================================================



const events = {
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    });

    console.log('trip added');
    console.log(tripData);

    const trip = new Trip(tripData);
    tripList.add(trip);
    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave
    })
    this.reset();
  },


  successfulSave(trip, response) {
    console.log('success!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('ERROR');
    console.log(trip);
    console.log(response);

    $('#status-messages ul').empty();

    console.log(response.responseJSON.errors);

    for(let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#status-messages ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#status-messages').show();
    trip.destroy();
  },

  sortTrips(event) {
    console.log(event); //this is so we can see what got clicked on
    console.log(this);
    //this is what we do to get the second word, the regex is for whitespace
    const classes = $(this).attr('class').split(/\s+/);

    // this allows us to sort the table based on the column and then sort back to the original.
    // looping through the classes ...
    classes.forEach((className) => {
      if (fields.includes (className)) {
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        }
        else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });
    $('.sort-field').removeClass('sort-field');
    $(this).addClass('sort-field');
  },

  showAllTrips() {
    $('#trips-section').removeClass('hidden');
    $('#trips-section').addClass('show');
  },
};


$(document).ready( () => {
  // $('main').html('<h1>backTrek!</h1>');
  tripTemplate = _.template($('#trip-template').html());
  detailTemplate = _.template($('#detail-template').html());

  tripList.on('update', render, tripList);

  tripList.fetch();

  $('#trips-table').on('click', 'tr', getIndividualTrip);

  $('#add-trip-form').submit(events.addTrip);
  $('.trip-info').click(events.showAllTrips);
  $('.sort').click(events.sortTrips);
  tripList.on('sort', render, tripList);

});
