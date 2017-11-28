// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models
import Trip from './app/models/trip';

const paris = new Trip({
  name: 'Paris Adventure',
  category: 'Urban',
  continent: 'Europe',
  cost: 100
});

$(document).ready( () => {
  console.log(paris);
});
