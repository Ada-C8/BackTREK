import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url: function() {
    return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get('tripID') + '/reservations'
  },
  initialize: function(attributes) {
    // console.log('reservation created!');
    // console.log(attributes);
  },
  validate: function(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = 'Name cannot be blank';
    }

    if (!attributes.age) {
      errors['age'] = 'Age cannot be blank';
    } else if (isNaN(attributes.age)) {
      errors['age'] = 'Age must be a number';
    }

    if (!attributes.email) {
      errors['email'] = 'Email cannot be blank';
    }

    console.log('errrrrors!');
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});

export default Reservation
