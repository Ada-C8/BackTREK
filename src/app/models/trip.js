import Backbone from 'backbone'

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // urlRoot() {
  //   return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('id') }`;
  // },
  toString() {
    return `<Trip id:${this.get("id")},name:${this.get("name")},continent:${this.get("continent")}, weeks:${this.get("weeks")}, cost:${this.get("cost")}, about:${this.get("about")}  >`;
  },

});

export default Trip;
