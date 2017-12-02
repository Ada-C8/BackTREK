// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//models and collections
import Trip from './models/trip';
import TripList from './collections/trip_list';


const tripList = new TripList();

let tripTemplate;
let tripInfoTemplate;
const render = function(tripList) {
  console.log('in render');
  tripTemplate = _.template($('#trip-list-template').html());
  tripInfoTemplate = _.template($('#trip-info-template').html());
  $('#trip-list').append('<tr><th>ID</th><th>CONTINENT</th><th>COST</th><th>CATEGORY</th></tr>');
  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.toJSON())).attr('id', `${trip.id}`);
  });

  console.log(tripList.models.length);
}

$(document).ready( () => {
  tripList.on('update', render, tripList);
  tripList.fetch();
  $('#load-trips').focus(function(event) {
    console.log(`in focus`);
    $('#trip-list').toggle();
    $(this).blur();
  });
  $('#trip-list').on('click', 'tr', function() {
    // const id = $(this).attr('id');
    const url = 'http://ada-backtrek-api.herokuapp.com/trips';
    $.get(url, function(response) {
      $('#trip-details').html(tripInfoTemplate(response));
    });

  });

  // console.log(tripList);
  // render(tripList);

});
