import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url() {
    return this.url;
  },
  initialize(attributes, options) {
    this.url = `https://ada-backtrek-api.herokuapp.com/trips/${options.trip}/reservations`;
  },
  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Name cannot be blank'];
    }

    if (!attributes.email) {
      errors['email'] = ['Email cannot be blank'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Reservation;
