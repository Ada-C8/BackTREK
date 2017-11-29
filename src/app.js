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

const render = function(tripList) {
  const tripTemplate = _.template($('#trip-template').html());
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append($(tripTemplate(trip.attributes)).attr('id', `${trip.id}`));
  })
}

const updateHandler = (list) => {

}

tripList.on('update', updateHandler)

$(document).ready( () => {
  $('#all-trips').hide();
  tripList.on('update', render, tripList);
  tripList.fetch();
  $('#show-all').on('click', function(){
    $('#all-trips').show();
  })

  $('#trip-list').on('click', 'tr', function(){
    const url = new Trip(this).url()
    console.log(url)
    $.get(url, response => {
      const thisTrip = response
      console.log(thisTrip.about)
      $('#trip-description').append(`<p>${thisTrip.about}<p>`);
    })

  })
});
