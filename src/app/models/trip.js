import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  // defaults: {
    // author: 'unknown',
  // },
  // validate(attributes) {
  //
  // },
  toString() {
    return `<Trip ${this.get('id')}: ${this.get('name')} in continent ${this.get('continent')}>`;
  },
  // parse: function(response) {
  //   console.log(response);
  // },
});


export default Trip;
