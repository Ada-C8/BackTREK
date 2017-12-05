// Defining the Model

import Backbone from 'backbone';

const Trip = Backbone.Model.extend({


  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',

  // validate: function(attributes) {
  //   const errors = {};
  //   const CONTINENTS = ['Asia', 'Africa', 'Australasia', 'Europe', 'South America', 'North America']
  //   if (!attributes.name) {
  //     errors['name'] = ['Trip must have a name.'];
  //   } //end name attribute
  //
  //   if (!attributes.continent) {
  //     errors[]
  //   }
  // } //end validate






  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
// url: function() {
//   console.log(this);
//   return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get("id");
// }
}); //end const Trip

export default Trip;


//
// urlRoot = 'https://ada-backtrek-api.herokuapp.com/trips'
