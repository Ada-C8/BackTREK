// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
import TripList from './app/collections/tripList';

// CSS
import './css/foundation.css';
import './css/style.css';


console.log('it loaded!');

$(document).ready( () => {
  const tripTemplate = _.template($('#tripTemplate').html());
  const tripList = new TripList();
  tripList.fetch();

  $('#tripButton').on('click', () => {
    tripList.fetch();
    tripList.forEach((trip) => {
      console.log('button working');
      const thisTrip = tripTemplate(trip.attributes);
      console.log($(thisTrip));
        //$('#tripSection').append($(thisTrip));
    });
  });
});
