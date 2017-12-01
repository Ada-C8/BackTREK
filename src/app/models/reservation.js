import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  validate(attr) {
    const errors = {};
    if (attr['name'] == "") {
      errors['name'] = ['cannot be blank'];
    }
    if (attr['email'] == "") {
      errors['email'] = ['cannot be blank'];
    }
    return Object.keys(errors).length > 0 ? errors : false;
  },
  urlRoot() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('tripID') }/reservations`;
  },
});

export default Reservation;
