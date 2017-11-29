// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from 'app/collections/trip_list';

const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();

let tripTemplate;

const render = function render(list) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  console.log(`tripList :${list}`);
  list.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });


};

$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');
  tripTemplate = _.template($('#trip-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);



  tripList.on('update', render, tripList);

  tripList.fetch({
    success: function(list, resp) {
      console.log('worked');
      console.log(list);

    },
    error: function() {
      console.log('error');
    }
  });
  console.log(`fetched`);

  // render(tripList);
  console.log(tripList);
});
