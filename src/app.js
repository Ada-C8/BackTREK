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

const testTrip = new Trip({
    name: "Cairo",
    continent: "Africa",
    category: "everything",
    weeks: 5,
    cost: 9599.99
  });

  // console.log(testTrip.cid);
  console.log(testTrip.attributes);

//
let tripTemplate;


$(document).ready( () => {
  // $('main').html('<h1>Hello World!</h1>');

  tripTemplate = _.template($('#trip-template').html() );

  const tripHTML = tripTemplate(testTrip.attributes);
  console.log(tripHTML);
  $('#trip-list').append(tripHTML);

}); // end document ready

// const generatedHTML = bookTemplate(myBook.atributes);
// $('#book-list').append(generatedHTML);






//
