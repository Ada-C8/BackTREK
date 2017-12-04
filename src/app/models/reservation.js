import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  model: Reservation,

  urlRoot: function () {
    console.log(this);
    const tripId = this.get('tripId');
    return `https://ada-backtrek-api.herokuapp.com/trips/${ tripId }/reservations`;
  },

  validate(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.email) {
      errors.weeks = ['cannot be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});

export default Reservation
