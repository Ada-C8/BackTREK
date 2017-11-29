// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

let tripsTemplate ;
const fields = ['id', 'name', 'continent', 'category','weeks','cost'];

const loadTrips = function loadTrips() {
  $('#trip-list').empty();
  const url = 'https://ada-backtrek-api.herokuapp.com/trips';
  $.get(url, (response) => {
    console.log(response);
    response.forEach((trip) => {
      $('#trip-list').append(tripsTemplate(trip));
    });
  });
};


$(document).ready( () => {
  tripsTemplate = _.template($('#trip-list-template').html());
  $('#load-trips').on('click', loadTrips);
});
