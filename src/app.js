// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip-list';

let tripTemplate;
let tripDetailTemplate;
let reserveModalTemplate;

const tripList = new TripList();

const render = function render(tripList) {
  const tripListElement = $('#trip-list ul');
  tripList.forEach((trip) => {
    const generatedHTML = $(tripTemplate(trip.attributes));
    generatedHTML.on('click', show);
    tripListElement.append(generatedHTML);
  });
};

const show = function show(e) {
  if (!$(e.target).hasClass('button')){
    const tripElement = $(e.target).closest('li');
    if (tripElement.hasClass('show')) {
      clearShow();
    } else {
      const id = tripElement[0].id;
      const trip = tripList.findWhere({id: 2});
      trip.fetch({
        success: () => {
          clearShow();
          $('.trip-row').removeClass('show');
          $('.trip-details').remove();
          const generatedHTML = $(tripDetailTemplate(trip.attributes));
          const reserveBtn = generatedHTML.find('.reserve-btn');
          reserveBtn.on('click', reserveModal);
          tripElement.append(generatedHTML).addClass('show');
        }
      });
    }
  }
};

const reserveModal = function reserveModal(e) {
  const id = $(e.target).closest('li')[0].id;
  const generatedHTML = $(reserveModalTemplate({'id': id}));
  const form = generatedHTML.find('#reservation-form');
  form.on('submit', submitReservation);
  $('body').append(generatedHTML);
};

const submitReservation = function submitReservation(e) {
  e.preventDefault();
  console.log(e);
  const formData = $(e.target).serialize();
};


const clearShow = function clearShow() {
  $('.trip-row').removeClass('show');
  $('.trip-details').remove();
};

const clearModal = function clearModal(e) {
  if ($(e.target).hasClass('modal-close')) {
    console.log('clearing modals');
    $('.modal').remove();
  }
};

$(document).ready( () => {
  $('#trip-list').hide();
  tripTemplate = _.template($('#trip-template').html());
  tripDetailTemplate = _.template($('#trip-detail-template').html());
  reserveModalTemplate = _.template($('#reserve-modal-template').html());

  tripList.on('update', render);

  $('#intro-button').on('click', (e) => {
    $('#intro-button').hide();
    tripList.fetch();
    $('#trip-list').show();
  });

  $('body').on('click', '.modal-close', clearModal);
});
