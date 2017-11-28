// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

let allTripsTemplate;
let tripHeadersTemplate;

const fields = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const loadTrips = function loadTrips() {
  $('#all-trips').empty();
  $('#trip-headers').empty();
  const url = 'https://ada-backtrek-api.herokuapp.com/trips';
  $.get(url, (response) => {
    fields.forEach((field) => {
      $('#trip-headers').append(tripHeadersTemplate({header: field}))
    });
    response.forEach((trip) => {
      $('#all-trips').append(allTripsTemplate(trip))
    })
  });
};

$(document).ready( () => {
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripHeadersTemplate = _.template($('#trip-headers-template').html());
  $('#load-trips').on('click', loadTrips);
});
