import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url: function() {
    // console.log(`we are in the reservation model -- ${this}`);
    // console.log(this);
    return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get('trip_id') + '/reservations';
  },
  validate(attributes) {
    const errors = {};

    if (!attributes.name ) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.age) {
      errors.age = ['cannot be blank'];
    }

    if (!attributes.email ){
      errors.email = ['cannot be blank'];
    }
    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

});


export default Reservation;
