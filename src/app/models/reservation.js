import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({

  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors.name = ['cannot be blank!'];
    }

    if (!attributes.email) {
      errors.email = ['cannot be blank!'];
    }

    // if there are no errors
    if (Object.keys(errors).length < 1) {
      return false;
    }

    // if there are errors
    return errors;
  }
});

export default Reservation;
