import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({

  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.email) {
      errors.email = ['cannot be blank'];
    }
  },

  urlRoot: function () {
   return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.attributes.tripId + '/reservations';
 },

});

export default Reservation;
