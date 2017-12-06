import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot: '/trips',
  initialize(attributes) {
    this.url = 'https://ada-backtrek-api.herokuapp.com/trips/' + attributes.trip_id + '/reservations';
  },

  validate: function(attributes) {

    const errors = {};
    if (!attributes.name) {
      errors['name'] = ["Name cannot be blank"];
    }

    if (!attributes.email) {
      errors['email'] = ["Email cannot be blank"];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    }
    return false;
  },

});

export default Reservation;
