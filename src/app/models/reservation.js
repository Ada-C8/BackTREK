import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlPrefix: 'https://ada-backtrek-api.herokuapp.com/trips',
  urlSuffix: '/reservations',
  // tripId: model.attributes.id,
  url: function() {
    let reservationUrl = this.urlPrefix;
    reservationUrl += '/' + this.attributes.trip_id + this.urlSuffix
    return reservationUrl;
  },

  validate(attributes) {
    const errors = {};
    if(!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if(!attributes.email) {
      errors.email = ['cannot be blank'];
    }

    if (!attributes.age){
      errors.age = ['cannot be blank'];
    }else if(Number(attributes.age)){
      this.set('age', Number(attributes.age));
    }else if(!Number(attributes.age)){
      errors.age = ['cannot be blank'];
    }

    if(Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});

export default Reservation;
