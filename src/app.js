// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

// models and collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
// practice data

const testTrip = new Trip({
    name: "Cairo",
    continent: "Africa",
    category: "everything",
    weeks: 5,
    cost: 9599.99
  });

const testTripTwo = new Trip({
  name: "Place",
  continent: "Asia",
  category: "Fun",
  weeks: 2,
  cost: 1000.15
})

//

const tripList = new TripList();
tripList.add(testTrip);
tripList.add(testTripTwo);

console.log(tripList.at(0));

let tripTemplate;

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    console.log(`Rendering trip ${ trip.get('name') }`);
    let tripHTML = tripTemplate(trip.attributes);
    tripListElement.append($(tripHTML));
  }); // for each
}; // render function


$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');
  console.log('in document ready');
  tripTemplate = _.template($('#trip-template').html() ); //same for collections and models


  // const tripList = new TripList();
  render(tripList);
  // The render function takes the place of the final part of the function for a single item.



}); // end document ready



  //
  //
  //
  // const tripHTML = tripTemplate(testTrip.attributes);
  // console.log(tripHTML);
  // $('#trip-list').append(tripHTML);
  //


//
