import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  baseURL: 'https://ada-backtrek-api.herokuapp.com/trips',
  url: function() {
    return this.baseURL + '/' + this.attributes.tripId + '/' + 'reservations';
  },

  validate: function(attributes) {
    const errors = {};
    if (!attributes.email) {
      errors['email'] = ['Email cannot be blank!'];
    }
    if (!attributes.name) {
      errors['name'] = ['Name cannot be blank!'];
    }
    // If you are using in an if statment, then you want it to evaluate to false
    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});


export default Reservation;
