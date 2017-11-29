// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';


import TripList from './app/collections/trip_list';

//Data from the API /trips
// {"id":1,"name":"Cairo to Zanzibar","continent":"Africa","category":"everything","weeks":5,"cost":9599.99}

//
const TRIP_FIELDS = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();
//
// // Starts undefined - we'll set this in $(document).ready
// // once we know the template is available

let tripTemplate;

const render = function render(tripList) {
//   iterate through the tripList, generate HTML
//   for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });
  console.log('ran render');
  console.dir(tripList);

  // SORTING
  // Provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${tripList.comparator}`).addClass('current-sort-field');

};

const renderSingleTrip = function render(trip) {

}


//ADDING A TRIP
// const addBookHandler = function(event) {
  // event.preventDefault();
//
// const tripData = {};
// TRIP_FIELDS.forEach((field) => {
//   // select the input corresponding to the field we want
//   const inputElement = $(`#add-book-form input[name="${ field }"]`);
//   const value = inputElement.val();
//   bookData[field] = value;
//
//   inputElement.val('');
// });
//
//   console.log("Read book data");
//   console.log(bookData);
//
//   const book = bookList.add(bookData);
//   book.save({}, {
//     success: (model, response) => {
//       console.log('Successfully saved book!');
//     },
//     error: (model, response) => {
//       console.log('Failed to save book! Server response:');
//       console.log(response);
//     },
//   });
// };
//
$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());

  console.log(`About to fetch data from ${ tripList.url }`);

// Register our update listener first, to avoid the race condition
  tripList.on('update', render);
  tripList.on('sort', render);

// Fetch is what gets the data
// When fetch gets back from the API call, it will add trips
// to the list and then trigger an 'update' event
  tripList.fetch();

  console.log(tripList);

//   // Listen for when the user adds a book
//   $('#add-book-form').on('submit', addBookHandler);
//
// Add a click handler for each of the table headers
// to sort the table by that column
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

});


// $(document).ready( () => {
//   $('main').html('<h1>Hello World!</h1>');
// });
