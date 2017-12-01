// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// CSS
import './css/foundation.css';
import './css/style.css';

const tripList = new TripList();
let tripTemplate;
let tripDetails;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append($(tripTemplate(trip.attributes)).attr('id', `${trip.id}`));
  });
};

// const continents = ['Africa', 'Antarctica', 'Asia', 'Australasia', 'Europe', 'South America', 'North America', 'Null'];

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripDetails = _.template($('#trip-details-template').html());

  $('#trip-list').hide();
  tripList.on('update', render, tripList);
  tripList.fetch();

  $('#all-trips').on('click', function() {
    $('#trip-list').toggle();
  });

  $('#trip-list').on('click', 'tr', function() {
    $('tr').css('background', '');
    const id = $(this).attr('id');
    const url = new Trip(this).url();

    $(`#${id}`).css('background','pink');

    $.get(url, function(response) {
      $(`#trip-details`).html(tripDetails(response));
    });
  });

  $('#add-trip-button').on('click', function() {
    $('#add-trip').css('display', 'block');
  });

  $(document).on('click', function() {
    const modal = document.getElementById('add-trip');

    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
});
