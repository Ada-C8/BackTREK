import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlPrefix: 'https://ada-backtrek-api.herokuapp.com/trips',
  urlSuffix: '/reservations',
  // tripId: model.attributes.id,
  url: function() {
    let reservationUrl = this.urlPrefix;
    reservationUrl += '/' + this.attributes.trip_id + this.urlSuffix

    debugger
    return reservationUrl;
  },
  // sync: function(method, model, options) {
  //   let reservationUrl = this.urlPrefix;
  //   reservationUrl += '/' + model.attributes.trip_id + this.urlSuffix
  //
  //   debugger
  //   return reservationUrl;
  // },
  // validate(attributes) {
  //
  //   const errors = {};
  //   if (!attributes.name) {
  //     errors.title = ['cannot be blank'];
  //   }
  //
  //   if (!attributes.email) {
  //     errors.author = ['cannot be blank'];
  //   }
  //
  //   if (!attributes.age) {
  //     errors.publication_year = ['cannot be blank'];
  //   }
  //
  //   if (Object.keys(errors).length < 1) {
  //     return false;
  //   }
  //   return errors;
  // },
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
