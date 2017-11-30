import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  baseURL: 'https://ada-backtrek-api.herokuapp.com/trips',
  url: function() {
    return this.baseURL + '/' + this.attributes.tripId + '/' + 'reservations';
  },

  validate: function(attributes) {
    // Save errors into a hash
    const errors = {};

    if (!attributes.email) {
      errors['email'] = ['Email cannot be blank!'];
    } else if (!attributes.name) {
      errors['name'] = ['Name cannot be blank!'];
    }
  },

});


export default Reservation;
