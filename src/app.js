// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from 'app/models/trip.js'
import TripList from 'app/collections/tripList.js'

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

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

// tripList.fetch().done(function() {
//   console.log('done');
//   render(tripList);
//   let currentTrip = new Trip();
// });


const render = function render(tripList) {
  console.log(tripList);
  tripList.forEach((trip) => {
    let currentTrip = new Trip({id: trip.id});
    currentTrip.fetch().done(function() {
      console.log(currentTrip.attributes);
      const tripTemplate =  _.template($('#trip-template').html());
      const tripHTML = tripTemplate(currentTrip.attributes);

      $('#trip-list').append(tripHTML);
      let id = currentTrip.get('id')
      console.log(`.current-trip-${id}`);

      // $(`.details ${id}`).ahide()
      // $(`.hide ${id}`).hide()
    });
  });
};

const tripDetailHandler = function (event){
  console.log(event.target.parentElement.id);
  let id = event.target.parentElement.id;
  $(`.details-${id}`).toggleClass('hide');
  $(`.button-${id}`).toggleClass('hide');
}

const reserveFormUpdate = function (event){
  console.log(event.target.parentElement.className);
  let id = event.target.parentElement.className

  let currentTrip = new Trip({id: id});
  currentTrip.fetch().done(function() {
    const nameTemplate =  _.template($('#name-template').html());
    console.log(nameTemplate)
    const nameHTML = nameTemplate(currentTrip.attributes);
    console.log(nameHTML)
    $('.form-container').removeClass('hide');
    $('#trip-name').text(nameHTML);
  });
}



$(document).ready( () => {
  tripList.fetch().done(function() {
    console.log('done');
    render(tripList);
    let currentTrip = new Trip();
  });

  $('#trip-list').on('click', 'button', tripDetailHandler);

  $('#trip-list').on('click', '.reserve', reserveFormUpdate)

});
