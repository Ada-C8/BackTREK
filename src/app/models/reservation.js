import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  url: function() {
    console.log('This is this:');
    console.log(this);
    return this.urlRoot + this.attributes.tripID + '/reservations';
  },

  validate(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors.name = ['can\'t be blank'];
    }

    if (!attributes.email) {
      errors.email = ['can\'t be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  }//end of validations
});





export default Reservation;
