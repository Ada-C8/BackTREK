// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//models and collections
import Trip from './models/trip';
import TripList from './collections/trip_list';

// console.log('it loaded!');

const tripList = new TripList();
// console.log(tripList);

let tripTemplate;

const render = function(tripList) {
  // const $tripList = $('#trip-list');
  console.log('in render');
  console.log(tripList.models);
  // $tripList.empty();
  tripTemplate = _.template($('#trip-button-template').html());
  tripList.forEach((trip) => {
    console.log(trip);
    console.log('in trip forEach');
    $('#trip-list').append(tripTemplate(trip.toJSON()));
  });
  // for(let i =0; i< tripList.models.length; i++) {
  //   console.log(tripList.models[i]);
  // };
  console.log(tripList.models.length);
}

$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');
  $('#load-trips').click(function(event) {
  tripList.on('update', render, tripList);
  tripList.fetch();
});

  // console.log(tripList);
  // render(tripList);

});
