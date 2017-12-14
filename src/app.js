// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
import Reservation from './app/models/reservations';
import TripList from './app/collections/tripList';


// CSS
import './css/foundation.css';
import './css/style.css';

const TRIP_FIELDS = ['name', 'category', 'weeks', 'cost', 'about', 'continent']

let tripTemplate;

const loadTrips = function loadTrips(trips) {
  const tripTable = $('#tripSection');
  tripTable.html('');
  trips.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTable.append(generatedHTML);
  });
}

$(document).ready( () => {
  tripTemplate = _.template($('#tripTemplate').html());
  const singleTripTemplate = _.template($('#singleTripTemplate').html());
  const tripList = new TripList();
  tripList.fetch();

  $('#singleTripSection').hide();
  $('#reservationForm').hide();
  $('#createTripSection').hide();
  $('#numberFilter').hide();


  $('#tripSection').on('click', 'tr', (e) => {
    $('#singleTripSection').show();
    $('#reservationForm').show();
    const baseURL = 'https://ada-backtrek-api.herokuapp.com/trips/'
    $.get(`${baseURL}${e.currentTarget.id}`, (response) => {
      const generatedHTML = singleTripTemplate(response);
      $('#singleTrip').html(generatedHTML);
    }).fail(() => {
      console.log('The post call failed');
    });
  });

  tripList.on('sort', loadTrips, tripList);
  tripList.on('update', loadTrips, tripList);

  $('#createTripButton').on('click', () => {
    $('#createTripSection').show();
  });

  const getData = function getData(target, values) {
  const data = {};
  values.forEach((value) => {
    let targetElement = target.find(`[name="${ value }"]`);
    data[value] = targetElement.val();
  });
  return data;
};

  $('#createTripForm').on('submit', (e) => {
    e.preventDefault();
    const data = getData($(e.target), ['name', 'continent', 'category', 'weeks', 'cost', 'about']);

    const newTrip = new Trip(data);
    if (newTrip.isValid()){
      newTrip.save({}, {
        success: (model, response) => {
          tripList.add(model);
          console.log('Yay, trip was saved successfully!');
        },
        error: (model, response) => {
          console.log('Failed to save trip! Server response:');
          console.log(response);
        },
      });

    }else {
      if ($('#nameField').val() === '') {
        $('#nameField').css('background-color','red');
      } else {
        $('#nameField').css('background-color','white');
      }

      if ($('#aboutField').val() === '') {
        $('#aboutField').css('background-color','red');
      } else {
        $('#aboutField').css('background-color','white');
      }

      if ($('#categoryField').val() === '') {
        $('#categoryField').css('background-color','red');
      } else {
        $('#categoryField').css('background-color','white');
      }

      if ($('#weeksField').val() === '') {
        $('#weeksField').css('background-color','red');
      } else {
        $('#weeksField').css('background-color','white');
      }

      if ($('#costField').val() === '') {
        $('#costField').css('background-color','red');
      } else {
        $('#costField').css('background-color','white');
      }
    }
  });

  $('#reservationForm').on('submit', (e) => {
    e.preventDefault();
    const data = getData($(e.target), ['name', 'email']);
    const id = $('#singleTrip li')[0].id;
    data['tripID'] = id;
    const newReservation = new Reservation(data);
    console.log(newReservation.isValid());

    if (newReservation.isValid()) {
      newReservation.save({}, {
        success: (response) => {
          console.log('Yay, trip was saved successfully!');
        },
        error: (status, response) => {
          console.log('Failed to save trip! Server response:');
          console.log(response);
        },
      });

    } else {
      if ($('#reservationName').val() === '') {
        $('#reservationName').css('background-color','red');
        console.log('name is now red');
      } else {
        $('#reservationName').css('background-color','white');
        console.log('name is now white');
      }

      if ($('#reservationEmail').val() === '') {
        $('#reservationEmail').css('background-color','red');
        console.log('email is now red');
      } else {
        $('#reservationEmail').css('background-color','white');
        console.log('email is now white');
      }
    }

  });

  TRIP_FIELDS.forEach((field) => {
    const header = $(`.sort.${field}`);
    header.on('click', () => {
      tripList.comparator = field;
      tripList.sort();
    });
  });


  $('#filter').on('change', () => {
    const filter = $('#filter')[0].value;
    if (filter === 'blank') {
      return false;
    } else if (filter === 'budget' || filter === 'weeks') {
      $('#textFilter').hide();
      $('#textFilter').val('');
      $('#numberFilter').show();
      $('#numberFilter').val('');
    } else {
      $('#textFilter').show();
      $('#textFilter').html('');
      $('#numberFilter').hide();
      $('#numberFilter').html('');
    }
    loadTrips(tripList);
  });

  $('#filterForm').on('submit', () => {
    const filter = $('#filter')[0].value;
    let value;
    if($('#numberFilter').is(':visible')){
      value = $('#numberFilter')[0].value;
    } else {
      value = $('#textFilter')[0].value;
    }

    const url = `https://ada-backtrek-api.herokuapp.com/trips/${filter}?query=${value}`;
    $.get(url, (response) => {

      $('#tripSection').html('');
      response.forEach((trip) => {
        $.get(`https://ada-backtrek-api.herokuapp.com/trips/${trip.id}`, (response) => {
            console.log(response);
            const generatedHTML = tripTemplate(response);
            $('#tripSection').append($(generatedHTML));
        }).fail(() => {
          console.log('The post call failed');
        });

      });
    });
    return false;
  });

  $('#numberFilter').on('keyup', () => {
      const value = $('#numberFilter')[0].value;
      const filter = $('#filter')[0].value;
      const elements = $('#tripSection').children();

      if (filter === 'weeks' || filter === 'budget') {
        if (value <= 0){
            $('#tripSection tr').each((index) => {
              const rowID = elements[index].id;
              $(`tr#${rowID}`).show();
            });
        } else {
          $('#tripSection tr').each((index) => {
            const rowID = elements[index].id;
            let rowValue;
            if (filter === 'weeks'){
              rowValue = $(`tr#${rowID} td:nth-child(5)`).html();
            } else {
              rowValue = $(`tr#${rowID} td:nth-child(6)`).html();
            }

            if (parseInt(rowValue) <= value){
              $(`tr#${rowID}`).show();
            } else {
              $(`tr#${rowID}`).hide();
            }
          });
        }
      }
  });

  $('#textFilter').on('keyup', () => {
      const value = $('#textFilter')[0].value.trim().toLowerCase();
      const filter = $('#filter')[0].value;
      const elements = $('#tripSection').children();

      if (filter === 'name' || filter === 'continent' || filter === 'category') {
        if (value === "") {
            $('#tripSection tr').each((index) => {
              const rowID = elements[index].id;
              $(`tr#${rowID}`).show();
            });
        } else {
          $('#tripSection tr').each((index) => {
            const rowID = elements[index].id;

            let rowValue;
            if (filter === 'name'){
              rowValue = $(`tr#${rowID} td:nth-child(2)`).html()
            } else if (filter === 'category') {
              rowValue = $(`tr#${rowID} td:nth-child(3)`).html();
            } else {
              rowValue = $(`tr#${rowID} td:nth-child(4)`).html();
            }
            rowValue = rowValue.toLowerCase();
            if (rowValue.indexOf(value) >= 0){
              $(`tr#${rowID}`).show();
            } else {
              $(`tr#${rowID}`).hide();
            }
          });
        }
      }
  });
});
