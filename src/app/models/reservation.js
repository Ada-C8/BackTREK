import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({

  validate: function(attributes) {
    console.log('What are the attributes in validate');
    console.log(attributes);
    // return empty array as test
    // return [];
    const errors = {};

    if (!attributes.name) {
      errors['name'] = 'cannot be blank';
    }

    if (!attributes.age) {
      errors['age'] = "cannot be blank";
    } else if( isNaN(parseInt(attributes.age)) ) {
      errors['age'] = "must be a number";
    } else if ( parseInt(attributes.age) < 0 || parseInt(attributes.age) > 150) {
      errors['age'] = "must be valid";
    }

    if (!attributes.email) {
      errors['email'] = 'cannot be blank';
    }

    console.log('ERRORS:');
    console.log(errors);

    if ( Object.keys(errors).length > 0 ) {
      return errors;
    } else {
      return false;
    }
  },
  urlRoot() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('trip').id}/reservations`;
  }

});

export default Reservation;
