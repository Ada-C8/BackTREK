import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  validate: function(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors['Name'] = ['cannot be blank']
    }
    if (!attributes.age) {
      errors['Age'] = ['cannot be blank']
    }
    if (!attributes.email) {
      errors['Email'] = ['cannot be blank']
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(attributes.email)) {
      errors['Email'] = ['must be a valid email']
    }
    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Reservation;
