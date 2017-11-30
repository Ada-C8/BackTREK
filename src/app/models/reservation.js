import Backbone from 'backbone';

//how to subclass one of the Backbone classes
const Reservation = Backbone.Model.extend({
  urlRoot: function(){
    return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.attributes.tripId + '/reservations';
  }
});

//makes Book available to any file that imports book.js
export default Reservation;
