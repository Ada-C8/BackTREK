// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// Initialize
const tripList = new TripList();
const tripListTemplate = _.template($('#trip-list-template').html());
const tripTemplate = _.template($('#trip-template').html());

const render = function render(list) {
  const $list = $('#trip-list');
  // $list.empty();
  list.forEach((trip) => {
    $list.append(tripListTemplate(trip.toJSON()));
  });
}

const events = {
  showTrips() {
    console.log('SHOW ME TRIPS!');
    $('button#show-trips').hide();
    $('#trip-table').show();
  },
  showTrip(event) {
    $('#reservation').show();
    console.log('MA TRIP!');
    const trip = new Trip({id: event.target.parentElement.id});
    trip.fetch({}).done(() => {
      $('#show-trip').html(tripTemplate(trip.attributes));
      console.log('YAY');
    }).fail(() => {
      $('#show-trip').html('<p>Looks like that trip left without you...</p>');
      console.log('OOPS');
    });
  },
  addTrip(event) {

  },
  successfulSave(trip) {
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>You booked ${trip.name}!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    $('#status-messages ul').empty();
    Object.entries(response.responseJSON.errors).forEach((error) => {
      for(let i = 0; i < error[1].length; i++) {
        $('#status-messages ul').append(`<li>${error[0]}: ${error[1][i]}</li>`);
      }
    });

    $('#status-messages').show();
    trip.destroy();
  },
}

console.log('it loaded!');

// -------------------------------------------------------
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("add-trip");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// -------------------------------------------------------


$(document).ready( function() {

  // On Start
  tripList.fetch();
  //   {}, {
  //   error: () => {
  //     $('#trip-table').html('<p>All the trips are on vacation</p>')
  //   }
  // });
  $('#sorting').hide();
  $('#trip-table').hide();
  $('#reservation').hide();

  // Event Trigger
  tripList.on('update', render, tripList);

  // Event Handler
  $('button#show-trips').click(events.showTrips);
  $('#trip-list').click('tr', events.showTrip);
});
