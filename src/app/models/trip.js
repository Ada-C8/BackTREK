import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // initialize: function(attributes) {
  //   // console.log(`In initialize: for the book ${ this.get('title') }`);
  // },
  //
  // validate(attributes) {
  //   // Note the argument. We will read attribute values from
  //   // here instead of calling this.get()
  //
  //   // Format of errors: same as Rails!
  //   // {
  //   //   title: ['cannot be blank', 'already taken'],
  //   //   author: ['cannot be blank']
  //   // }
  //   // 'id', 'name', 'continent', 'category', 'weeks', 'cost'
  //   const errors = {};
  //
  //   if (!attributes.name) {
  //     errors.name = ['cannot be blank'];
  //   }
  //
  //   if (!attributes.continent) {
  //     errors.continent = ['cannot be blank'];
  //   }
  //
  //   if (!attributes.category) {
  //     errors.category = ['cannot be blank'];
  //   }
  //
  //   if (!attributes.weeks) {
  //     errors.weeks = ['cannot be blank'];
  //   } else if (isNaN(attributes.weeks)){
  //     errors.weeks = ['must be a number'];
  //   }
  //
  //   if (!attributes.cost) {
  //     errors.cost = ['cannot be blank'];
  //   } else if (isNaN(attributes.cost)) {
  //     errors.cost = ['must be a number'];
  //   }
  //
  //   if (Object.keys(errors).length < 1) {
  //     return false;
  //   }
  //   return errors;
  // }
});
// TODO: See why this crashes my program.

export default Trip;
