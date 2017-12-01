import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  url: function() {
    console.log('This is this:');
    console.log(this);
    return this.urlRoot + this.attributes.tripID + '/reservations';
  }
});

// let tripID = $(this).attr('data-id');



export default Reservation;
