import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  // model: Trip,
  //set trip id as an attribute in reservation
  urlRoot () {
    return`https://trektravel.herokuapp.com/trips/${this.get('tripID')}/reservations`
  },

  toString() {
    return `<Reservation ${this.get('name')}>`;
  },
  
  validate(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors.name = [' cannot be blank'];
    }

    if (!attributes.email) {
      errors.email = [' cannot be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

});

export default Reservation;
