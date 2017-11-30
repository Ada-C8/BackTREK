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
  fetchTrip() {
    const trip = tripList.get($(this).data('id'));
    trip.fetch({
      success: events.successfulTripFetch,
      error: events.failedTripFetch,
    });
  },
  successfulTripFetch(trip) {
    let $tripDetails = $('#trip-details');
    $tripDetails.empty();
    $tripDetails.append(tripDetailsTemplate(trip.attributes));
  },
  failedTripFetch(trip) {
    console.log('failed trip fetch');
  },
  hideModal(event){
    // TODO: click out of the modal and close
    console.log('hid modal!');
    $('#create-trip-modal').hide();
  },
  showModal(){
    console.log('show modal!');
    $('#create-trip-modal').show();
  },
  addTrip(){

  }
}


// TEMPLATE RENDERING
const tripList = new TripList();
let allTripsTemplate;
let tripDetailsTemplate;

const renderAllTrips = function renderAllTrips(tripList) {
  let $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(allTripsTemplate(trip.attributes));
  });
};

$(document).ready( () => {
  // TEMPLATES
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // render template for all trips
  tripList.on('update', renderAllTrips, tripList);
  tripList.fetch();

  // render template for trip details (on click)
  $('#trip-list').on('click', '.trip', events.fetchTrip);

  // render modal for adding a trip
  $('#create-trip-btn').click(events.showModal);
  $('.close').click(events.hideModal);

  //submit forms
  $('#create-trip-form').submit(events.addTrip);
  // $('#create-reservation-form').submit(events.addReservation);
});
