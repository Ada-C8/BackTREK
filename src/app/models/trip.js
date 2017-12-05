// Defining the Model

import Backbone from 'backbone';

const Trip = Backbone.Model.extend({


  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/'



  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
// url: function() {
//   console.log(this);
//   return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get("id");
// }
}); //end const Trip

export default Trip;


//
// urlRoot = 'https://ada-backtrek-api.herokuapp.com/trips'
