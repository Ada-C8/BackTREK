// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';

const tripList = new TripList();
let tripTemplate;

const render = function render() {
  const tableElement = $('#trip-list');
  tableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);

    tableElement.append(generatedHTML);
  });
};



$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', render)

  tripList.fetch();
});
