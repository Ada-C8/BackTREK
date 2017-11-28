// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import TripList from './app/collections/trip_list';
// import Trip from './app/models/trip';


let myTrip = {
  "id":1,
  "name":"Cairo to Zanzibar",
  "continent":"Africa",
  "category":"everything",
  "weeks":5,
  "cost":9599.99
};

const tripList = new TripList();

tripList.add(myTrip);
console.log(tripList);

$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');
});
