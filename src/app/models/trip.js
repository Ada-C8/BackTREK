import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  defaults: {
    name: 'Unknown'
  },
urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/'


// urlRoot(){
// return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('tripID')}/reservations`
// }
  // validate(attributes) {
  //   const errors = {};
  //   if (!attributes.name) {
  //     errors.name = ['cannot be blank'];
  //   }
  //
  //   if (!attributes.email) {
  //     errors.email = ['cannot be blank'];
  //   }
  //
  //   if (Object.keys(errors).length < 1) {
  //     return false;
  //   }
  //   return errors;
  // },
});

export default Trip;
