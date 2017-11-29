// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';


import TripList from './app/collections/trip_list';

const TRIP_FIELDS = ['name', 'continent', 'weeks'];

const tripList = new TripList();

let tripTemplate;
let aboutTemplate;

const loadTrip = function loadTrip(event) {
  // let trip = new Trip({id: event.currentTarget.id});
  const aboutTableElement = $('#about');
  tripList.forEach((trip) => {
    if(trip.id.toString() === event.currentTarget.id) {
      console.log(trip);
      // NOT CURRENTLY WORKING BC I HAVE TO SEND REQUEST TO URL TRIPS/ID
      // const generatedHTML = aboutTemplate(trip.about)
      // aboutTableElement.html('')
      // aboutTableElement.append(generatedHTML);
    }
  })
  // tripList.forEach((trip) => {
  //   // console.log(event);
  //   // console.log(`passed id: #{id})`;
  //   // console.log(trip.id);
  //   if(trip.id === id) {
  //     const generatedHTML = aboutTemplate(tripList.attributes)
  //     aboutTableElement.append(generatedHTML);
  //   }
  // })

};

const loadTrips = function loadTrips(tripList) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};




// const addBookHandler = function(event) {
//   event.preventDefault();
//
//   const bookData = {};
//   BOOK_FIELDS.forEach((field) => {
//     // select the input corresponding to the field we want
//     const inputElement = $(`#add-book-form input[name="${ field }"]`);
//     const value = inputElement.val();
//     bookData[field] = value;
//
//     inputElement.val('');
//   });
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



$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  aboutTemplate = _.template($('#about-template').html());

  tripList.on('update', loadTrips);
  tripList.on('sort', loadTrips);

  tripList.fetch();

  // $('#add-book-form').on('submit', addBookHandler);

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  console.log('about to load trip');


  $('table').on('click', 'tr', loadTrip);
});


// let loadTrips = function loadTrips() {
//   $('#load').hide('slow')
//
//   $.get('https://trektravel.herokuapp.com/trips',
//   (response) => {
//     response.forEach(function(trip) {
//       let tripInfo = `<div class = "inside" id=${trip.id}> <h3 id=${trip.id} > ${trip.name} </h3> </div>`;
//
//       $('#single-trip').html('');
//       $(tripInfo).appendTo('#many-trips').show('slow');
//
//     });
//   })
//   .fail(function(response){
//     console.log(response);
//     $('#fail').html('<p>Request was unsuccessful</p>')
//   });
// };
//
// let loadTrip = function loadTrip(id){
//   $.get(`https://trektravel.herokuapp.com/trips/${id}`,
//     (response) => {
//       console.log(response);
//       let tripInfo =
//       `<p> ID: ${response.id} </p>
//       <p> Name: ${response.name} </p>
//       <p> Category: ${response.category} </p>
//       <p> About: ${response.about} </p>
//       <p> Continent: ${response.continent} </p>
//       <p> Weeks: ${response.weeks} </p>
//       <p> Cost: ${response.cost} </p>
//       <form class="reserve" action="index.html" method="post">
//       <label for="name">Name:</label>
//       <input id="text" type="text" name="name" value=""></input>
//       <input class="button" id="submit" type="submit" name="submit" value="Reserve">
//       </form>`;
//
//       let numberId = response.id
//       let stringId = numberId.toString()
//
//       $(`<div id='open' style="display: none;">${tripInfo}</div>`).appendTo(`#${stringId}`).show('slow');
//       $(`#${stringId}`).append(`<div class='status'></div>`);
//
//       submit(response.name)
//
//     })
//     .fail(function(response){
//       console.log(response);
//       $('#fail').html('<p>Request was unsuccessful</p>')
//     });
//   };
//
//
//   $('#many-trips').on('click', 'h3', function(){
//     let tripID = $(this).attr('id');
//     if($(`#${tripID}`).find('#open').length > 0){
//       $('#open').hide('slow', function(){$('#open').remove();});
//       $('.status').remove()
//     }
//     else {
//       loadTrip(tripID);
//     }
//   });
//
//   $('#load').on('click', function(){
//     loadTrips();
//   });
//
//
// });
//
//
//     const url = 'https://trektravel.herokuapp.com/trips/1/reservations';
//
//     const successCallback = function(name) {
//       console.log('POST was successful');
//       let generatedHTML = `<p> You have successfully reserved a spot on ${name}! </p>`
//       $('.status').html(generatedHTML)
//       $('.reserve').hide('slow')
//
//     };
//     const submit =  function submit(name){
//     $('.reserve').on('submit', function(event) {
//       event.preventDefault();
//       console.log("IN SUBMIT")
//       let formData = $('.reserve').serialize();
//       $.post(url, formData, successCallback(name)).fail((response) => {
//         console.log("Failure");
//         let generatedHTML = `<p> Something went wrong, we were not able to reserve a spot for you </p>`
//         $('.status').html(generatedHTML)
//       });
//     })};
