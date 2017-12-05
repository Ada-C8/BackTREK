import Backbone from 'backbone';
import _underscore from 'underscore';

const Reservation = Backbone.Model.extend({
  initialize: function(attributes) {
  },
  validate: function(attributes){
    const errors = {};
    const reservationFields = ['name', 'age', 'email'];

    // checks for blanks
    const blank_attributes = _underscore.difference(reservationFields, Object.keys(attributes));
    if (blank_attributes.length > 0){
      blank_attributes.forEach((attr) => {
        errors[attr] = `cannot be blank`;
      });
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});

export default Reservation;
