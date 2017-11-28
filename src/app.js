// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';


const tripList = new TripList();


$(document).ready( () => {
  console.log(tripList);
});
