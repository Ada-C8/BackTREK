import Backbone from 'backbone';

//how to subclass one of the Backbone classes
const Reservation = Backbone.Model.extend({
  urlRoot: function(){
    return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.attributes.tripId + '/reservations';
  },


  validate(attributes) {
    console.log(attributes);
    const errors = {};

    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.email) {
      errors.email = ['cannot be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  }

});

//makes Book available to any file that imports book.js
export default Reservation;
