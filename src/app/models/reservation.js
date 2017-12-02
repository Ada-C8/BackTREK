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
  // sync: function(method, model, options) {
  //   let reservationUrl = this.urlPrefix;
  //   reservationUrl += '/' + model.attributes.trip_id + this.urlSuffix
  //   return reservationUrl;
  // },
  // Note to teacher:  What's the difference between the sync function and urlRoot

  validate(attributes) {

    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.email) {
      errors.email = ['cannot be blank'];
    }

    if (!attributes.age) {
      errors.age = ['cannot be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
  //
  //
  //
  // age() {
  //   return (this.get('age');
  // },
  // toString() {
  //   return `<Reservation ${ this.get('title') }>`;
  // },

  //
});

export default Reservation;
