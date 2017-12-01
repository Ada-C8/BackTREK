import Backbone from 'backbone'

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // urlRoot() {
  //   return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('tripId') }`;
  // },
  toString() {
    return `<Trip name:${this.get("name")},continent:${this.get("continent")}, weeks:${this.get("weeks")}, cost:${this.get("cost")} >`;
  },

});

export default Trip;
