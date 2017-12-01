import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  validate: function(attributes){
    console.log('reservation attributes');
    const errors = {};
    const reservationFields = ['name', 'age', 'email'];

    // checks for blanks
    const blank_attributes = _underscore.difference(reservationFields, Object.keys(attributes));
    if (blank_attributes.length > 0){
      blank_attributes.forEach((attr) => {
        errors[attr] = `cannot be blank`;
      });
    }
    console.log(errors);

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});
