// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
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

  $('#createTripForm').on('submit', (e) => {
    e.preventDefault();
    let valid = true;
    if ($('#nameField').val() === '') {
      $('#nameField').css('background-color','red');
      valid = false;
    } else {
      $('#nameField').css('background-color','white');
    }

    if ($('#aboutField').val() === '') {
      $('#aboutField').css('background-color','red');
      valid = false;
    } else {
      $('#aboutField').css('background-color','white');
    }

    if ($('#categoryField').val() === '') {
      $('#categoryField').css('background-color','red');
      valid = false;
    } else {
      $('#categoryField').css('background-color','white');
    }

    if ($('#weeksField').val() === '') {
      $('#weeksField').css('background-color','red');
      valid = false;
    } else {
      $('#weeksField').css('background-color','white');
    }

    if ($('#costField').val() === '') {
      $('#costField').css('background-color','red');
      valid = false;
    } else {
      $('#costField').css('background-color','white');
    }

    if (valid){
      const url = 'https://ada-backtrek-api.herokuapp.com/trips';
      const data = $('#createTripForm').serialize();

      $.post(url, data, (response) => {
        const newTrip = new Trip(response);
        tripList.add(newTrip);
        $('#createTripSection').hide();
      }).fail(() => {
        console.log('The post call failed');
      });
      return false;
    }
  });

  $('#reservationForm').on('submit', () => {
    let valid = true;
    if ($('#reservationName').val() === '') {
      $('#reservationName').css('background-color','red');
      valid = false;
    } else {
      $('#reservationName').css('background-color','white');
    }

    if ($('#reservationEmail').val() === '') {
      $('#reservationEmail').css('background-color','red');
      valid = false;
    } else {
      $('#weeksField').css('background-color','white');
    }

    if (valid) {
      const id = $('#singleTrip li')[0].id;

      const url = `https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations`
      const data = $('#reservationForm').serialize();

      $.post(url, data, () => {
        $('#reservationName').val('');
        $('#reservationEmail').val('');
        $('#reservationForm').hide();
        $('#singleTripSection').hide();
      }).fail(() => {
        console.log('The post call failed');
      });
    }
    return false;
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
