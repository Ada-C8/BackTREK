// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
tripList.fetch();

let bookTemplate;

const render = function render(bookList) {
  const $bookList = $('#book-list');
  $bookList.empty();
  bookList.forEach((book) => {
    $bookList.append(bookTemplate(book.attributes));
  });
};

const fields = ['title', 'author', 'publication_year']

const events = {
  addBook(event) {
    event.preventDefault();
    const bookData = {};
    fields.forEach( (field) => {
      bookData[field] = $(`input[name=${field}]`).val();
    });
    const book = new Book(bookData);
    bookList.add(book);
    book.save({}, {
      success: events.successfulSave,
      error: events.failedSave
    });
  },

  sortBooks(event) {
    console.log(event);
    console.log(this);
    const classes = $(this).attr('class').split(/\s+/);

    bookList.comparator = classes[1];

    if (classes.includes('current-sort-field')) {
      $(this).removeClass('current-sort-field');
      bookList.set(bookList.models.reverse());
      render(bookList);

    } else {
      $('.current-sort-field').removeClass('current-sort-field');
      $(this).addClass('current-sort-field');
      bookList.sort();
    };
  },

  successfulSave(book, response){
    console.log('success!');
    console.log(book);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${book.get('title')} added!</li>`);
    $('#status-messages ul').show();
  },

  failedSave(book, response) {
    console.log('error');
    console.log(book);
    console.log(response);
    book.destroy();
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${book.get('title')} added!</li>`);
    $('#status-messages ul').show();
  },

};




$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());
  $('#add-book-form').submit(events.addBook);
  $('.sort').click(events.sortBooks);

  bookList.on('update', render, bookList);
  bookList.on('sort', render, bookList);

});
