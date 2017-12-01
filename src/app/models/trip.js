import Backbone from 'backbone'

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // urlRoot() {
  //   return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('tripId') }/reservations`;
  // },
  toString() {
    return `<Trip ${ this.get('name') }>`;
  },

});

export default Trip;
