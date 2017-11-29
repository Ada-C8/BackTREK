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

// const trip = new Trip({
//   id: 4,
//   name: 'Cairo to Zanzibar',
//   continent: 'Africa',
//   category: 'everything',
//   weeks: 5,
//   cost: 9599.99
// });

// console.log(trip.attributes)
// console.log(trip.get('id'))
// console.log(trip.get('name'))

const tripList = new TripList();
tripList.fetch().done(function() {
  console.log('done');
  render(tripList);
});

let currentTrip = new Trip();

// console.log(tripList);

const render = function render(tripList) {
  console.log(tripList);
  tripList.forEach((trip) => {
    let currentTrip = new Trip({id: trip.id});
    currentTrip.fetch().done(function() {
      console.log(currentTrip.attributes);
      const tripTemplate =  _.template($('#trip-template').html());
      const tripHTML = tripTemplate(currentTrip.attributes);
      let id = currentTrip.get('id')
      $('#trip-list').append(tripHTML);
      $(`.current-trip`).hide()
    });
  });
};



// const trip = new Trip();
// trip.fetch().done(function() {
//   console.log('done trip');
//   console.log(trip.attributes)
// });


// console.log(tripList.at[0])

//
// tripList.forEach((trip) => {
//   console.log(`${ trip.get('name') }`);
//   console.log('in here?')
// });
//
// const trip = new Trip({
//   id: 400,
//   name: 'Cairo to Zanzibar',
//   continent: 'Africa',
//   category: 'everything',
//   weeks: 5,
//   cost: 9599.99
// });

$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');
  // $('trip').append(trip);
  render(tripList)
  $('#trip-list').on('click', 'li',  function(event) {
    console.log(event.target.id)
    let id = event.target.id
    $(`.current-trip`).show()
  });
  // let atrip = new Trip({
  //    id: 1,
  // });
  // let atrip = new Trip({
  //   id: 400,
  //   name: 'around the world in 80 days',
  //   continent: 'Africa',
  //   category: 'everything',
  //   weeks: 5,
  //   cost: 9599.99
  // });
  // // atrip.save({}, );
  // console.log(atrip.attributes)
  // // atrip.set({url: `/${atrip.id}`});
  // atrip.fetch();
  // console.log(`i am something? ${atrip.attributes}`)

});
