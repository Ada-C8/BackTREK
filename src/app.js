  // Vendor Modules
  import $ from 'jquery';
  import _ from 'underscore';

  // CSS
  import './css/foundation.css';
  import './css/style.css';

  // Our components
  import Trip from './app/models/trip';
  import Reservation from './app/models/reservation';
  import TripList from './app/collections/trip_list';
  console.log('it loaded!');

  const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
  const RESERVATION_FIELDS = ['name', 'age', 'email'];

  let tripsTemplate;
  let tripTemplate;

  const render = function render(tripList){
    const tripsTableElement = $('#trip-list');
    tripsTableElement.html('');

    tripList.forEach((trip) => {
      const generatedHTML = $(tripsTemplate(trip.attributes));
      generatedHTML.on('click',(event) => {
        trip.fetch({
          success: function(model, response){
            renderTrip(model);
            $('#trips').hide();
            $('#trip').show();
          }
        });
      }); //.on
      tripsTableElement.append(generatedHTML);
    }); //tripList
  };  // render


  const renderTrip = function render(trip){
    const tripTableElement = $('#trip');
    tripTableElement.html('');

    const generatedHTML = $(tripTemplate(trip.attributes));
    tripTableElement.html(generatedHTML);
  };


  $(document).ready(() => {
    tripsTemplate = _.template($('#trips-template').html());
    tripTemplate = _.template($('#trip-template').html());

    const tripList = new TripList();
    tripList.on('update',render);

    $('#load').on('click', function(){
      // $('#trip-list').show();
      tripList.fetch({
        success: function(collection, response){
          $('#trips').show();
          $('#trip').hide();
        }
      });
    });

    // $('#add_trip').on('click', function(){
    //   $('#show_form').show();
    // };
    $("#add-trip-form").on('submit', function(event){
      event.preventDefault(); // stops after reading user input, doesn't do anything yet
      let tripData = {};

      TRIP_FIELDS.forEach((field) => {
        tripData[field] = $(`#add-trip-form input[name="${field}"]`).val();
      });

      let trip = new Trip(tripData);

      trip.save({}, {
        success: function(model, response){
          tripList.add(model);
        }
      })
    });

    $("#trip").on('submit', "#reservation-form", function(event){
      event.preventDefault();
      let reservationData = {};

      RESERVATION_FIELDS.forEach((field) => {
        reservationData[field] = $(`#reservation-form input[name="${ field }"]`).val();
      });

      let reservation = new Reservation(reservationData);
      console.log(`hello ${reservation}`);
      reservation.set('trip_id', $(this).data('tripId'));
      console.log(`hello ${reservation}`);

      reservation.save({}, {
        success: function(model, response){
          console.log(`Thank you, your reservation has been placed successfully`);
        }
      });
    });

  });

 // for ${reservationData['name']}
