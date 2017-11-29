// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

// models and collections
import Trip from './app/models/trip';

// practice data

// [{name :"Cairo to Zanzibar","continent":"Africa","category":"everything","weeks":5,"cost":9599.99},{"id":2,"name":"Everest Base Camp Trek","continent":"Asia","category":"adventure","weeks":2,"cost":967.5},{"id":3,"name":"Golden Triangle","continent":"Asia","category":"historical","weeks":1,"cost":590.53},

const testTrip = new Trip({
    name: "Cairo",
    continent: "Africa",
    category: "everything",
    weeks: 5,
    cost: 9599.99
  });

  // console.log(testTrip.cid);
  console.log(testTrip.attributes);










$(document).ready( () => {
  $('main').html('<h1>Hello World!</h1>');
});
