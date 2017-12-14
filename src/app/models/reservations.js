import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({

  url: function() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('tripID')}/reservations`;
  },

  validate(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors.name = ['Name must not be blank'];
    }

    if (!attributes.email) {
      errors.weeks = ['Email must not be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});
export default Reservation;
