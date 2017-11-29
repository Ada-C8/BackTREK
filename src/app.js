// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Import Trip Model and Collection
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const fields = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const events = {
  showDetails(id){
    console.log(id);
  }
}



const tripList = new TripList();
let tripTemplate;

const render = function render(tripList) {
  let $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.on('update', render, tripList);
  tripList.fetch();

  $('#trip-list').on('click', '.trip', function callback() {
      events.showDetails($(this).data('id'));
  });

  const zanzibar = new Trip({ id: 1 }).fetch();
  console.log(zanzibar);
});
