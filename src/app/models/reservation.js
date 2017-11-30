import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Cannot be blank'];
    }
    if (!attributes.email) {
      errors['email'] = ['Cannot be blank'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Reservation;
