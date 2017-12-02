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
  $('#trip-list').append('<tr><th>ID</th><th>CONTINENT</th><th>COST</th><th>CATEGORY</th></tr>');
  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.toJSON()));
  });

  $('tr').click(function() {
    console.log('inside click');
    const selectedId = parseInt($(this)[0].id);
    console.log(selectedId);
    const url = `http://ada-backtrek-api.herokuapp.com/trips/${selectedId}`;
    // const selectedTrip = new Trip({id: selectedId});
    const selectedTrip = tripList.findWhere({id: selectedId});
    console.log(url);
    // debugger;
    // selectedTrip.fetch(
    //   {
    //     success: function(selectedTrip){
    //       console.log('hey it logged success lol');
    //       $('header').html(tripInfoTemplate(selectedTrip));
    //     },
    //     error: function() {
    //       console.log('doesnt work sorry lol');
    //     }
      // })
    $.get(url, function(response) {
      console.log('trying to get trip');
      $('#trip-list').removeClass("small-11");
      $('#trip-list').addClass("small-6");
      $('#trip-details').html(tripInfoTemplate(response));
    });
  });

  console.log(tripList.models.length);
}

$(document).ready( () => {
  tripTemplate = _.template($('#trip-list-template').html());
  tripInfoTemplate = _.template($('#trip-info-template').html());
  $('#trip-list').hide();
  tripList.on('update', render, tripList);
  tripList.fetch();


  $('#load-trips').click(function(event) {
    event.preventDefault();
    console.log(`in focus`);
    $('#trip-list').toggle();
    $(this).blur();

  });




}); // end of document ready
