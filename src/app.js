// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from 'app/models/trip.js'
import TripList from 'app/collections/tripList.js'

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');



// const render = function render(tripList) {
//   tripList.forEach((trip) => {
//     const tripTemplate = _.template($('#trip-template').html());
//     const tripHTML = tripTemplate(trip.attributes);
//     $('#trip-list').append(tripHTML);
//   });
// };

const trip = new Trip({
  id: 4,
  name: 'Cairo to Zanzibar',
  continent: 'Africa',
  category: 'everything',
  weeks: 5,
  cost: 9599.99
});

// console.log(trip.attributes)
// console.log(trip.get('id'))
// console.log(trip.get('name'))

const tripList = new TripList();
tripList.fetch().done(function() {
  console.log('done');
  render(tripList);
});
// console.log(tripList);

const render = function render(tripList) {
  console.log(tripList);
  tripList.forEach((trip) => {
    console.log('here');
    const tripTemplate =  _.template($('#trip-template').html());
    const tripHTML = tripTemplate(trip.attributes);
    console.log(tripHTML)
    $('#trip-list').append(tripHTML);
  });
};




// console.log(tripList.at[0])

//
// tripList.forEach((trip) => {
//   console.log(`${ trip.get('name') }`);
//   console.log('in here?')
// });

$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');
  // $('trip').append(trip);
  render(tripList)
});
