// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip-list';
import Reservation from './app/models/reservation';

let tripTemplate;
let tripDetailTemplate;
let reserveModalTemplate;
let addTripModalTemplate;

// Trip List

const tripList = new TripList();

const render = function render(tripList) {
  $('.trip-row').remove();
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
      const id = parseInt(findElementTripID(e));
      const trip = tripList.findWhere({id: id});
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

const clearShow = function clearShow() {
  $('.trip-row').removeClass('show');
  $('.trip-detail-holder').remove();
};

const sort = function sort(e) {
  $('.current-sort').removeClass('current-sort');
  let targetElement = $(e.target);
  let field = targetElement[0].id;
  tripList.comparator = field;
  targetElement.addClass('current-sort');
  tripList.sort();
  render(tripList);
};

// Filtering

const filter = function filter(e) {
  e.preventDefault();
  const form = $('#trip-search');
  console.log(form);
  const searchData = getFormData(form, ['search-type', 'query']);
  console.log(searchData);
  const newList = tripList.filterBy(searchData['search-type'], searchData['query']);
  render(newList);
};

// Modals

const addTripModal = function addTripModal() {
  $('body').append(addTripModalTemplate());
};

const reserveModal = function reserveModal(e) {
  const id = findElementTripID(e);
  const generatedHTML = $(reserveModalTemplate({'id': id}));
  const form = generatedHTML.find('#reservation-form');
  form.on('submit', submitReservation);
  $('body').append(generatedHTML);
};

const clearModal = function clearModal(e) {
  if ($(e.target).hasClass('modal-close')) {
    $('.modal').remove();
  }
};

// Forms

const submitTrip = function submitTrip(e) {
  e.preventDefault();
  clearErrors();
  const form = $(e.target);
  const formData = getFormData(form, ['name', 'continent', 'category', 'weeks', 'cost', 'about']);
  console.log(formData);
  const newTrip = new Trip(formData);
  saveIfValid(newTrip, form, 'trip');
};

const submitReservation = function submitReservation(e) {
  e.preventDefault();
  clearErrors();
  $('.form-messages').html('');
  const form = $('#reservation-form');
  const id = form[0].classList[0];
  // can this ID be transmitted with the form instead?
  const formData = getFormData($(e.target), ['name', 'email']);
  formData['tripID'] = id;
  const newReservation = new Reservation(formData);
  saveIfValid(newReservation, form, 'reservation');
};

const getFormData = function getFormData(target, values) {
  const formData = {};
  values.forEach((value) => {
    let targetElement = target.find(`[name="${ value }"]`);
    formData[value] = targetElement.val();
  });
  return formData;
};

const saveIfValid = function saveIfValid(object, form, type) {
  if (object.isValid()) {
    object.save({}, {
      success: (response) => {
        formSuccess(type, form)
      },
      error: (status, response) => {
        const errors = ($.parseJSON(response.responseText))['errors'];
        printErrors(errors, type);
      },
    });
  } else {
    console.log(object.validationError);
    printErrors(object.validationError, type);
  }
};

const formSuccess = function formSuccess(item, form) {
  const messageBox = $(form.find('.form-messages'));
  console.log(messageBox);
  messageBox.html(`<p class="success">Successfully created ${item}!</p>`);
  form[0].reset();
}

const printErrors = function printErrors(errors, type) {
  for(let field in errors) {
    let errorElementID = `#${type}-${field} label`
    let errorElement = $(errorElementID);
    errorElement.addClass('has-errors');
    errorElement.append(`<p class="error">${errors[field]}</p>`);
  }
};

const clearErrors = function clearErrors() {
  $('.has-errors').removeClass('has-errors');
  $('.error').remove();
};

const findElementTripID = function findElementTripID(e) {
  return $(e.target).closest('li')[0].id;
};

$(document).ready( () => {
  $('.on-load').hide();
  tripTemplate = _.template($('#trip-template').html());
  tripDetailTemplate = _.template($('#trip-detail-template').html());
  reserveModalTemplate = _.template($('#reserve-modal-template').html());
  addTripModalTemplate = _.template($('#add-trip-modal-template').html());

  tripList.on('update', render);

  $('#intro-button').on('click', (e) => {
    $('#intro-button').hide(200);
    $('#loading').show(500);
    tripList.fetch({
      success: () => {
        $('#loading').hide(200);
        $('#trip-list').show(500);
      },
    });
    $('.on-load').show(500);
  });

  $('.sort').on('click', sort);

  $('#add-trip').on('click', addTripModal);
  $('body').on('click', '.modal-close', clearModal);

  $('body').on('keyup', '#trip-search', filter);
  $('#trip-search').on('submit', e => e.preventDefault());

  // $(document).on('submit', '#reservation-form', submitTrip;
  $(document).on('submit', '#add-trip-form', submitTrip);

});
