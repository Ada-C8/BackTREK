// Defining the Model

import Backbone from 'backbone';

const Trip = Backbone.Model.extend({

  // url: `https://ada-backtrek-api.herokuapp.com/trips/${this.get("trip_id") }`
  // create a Trip subclass that inherits from Backbone.Model
  // url: function() {
  //   return
  //  `https://ada-backtrek-api.herokuapp.com/trips/${this.get("trip_id")}`;
  //
  //   }
  // urlRoot: `https://ada-backtrek-api.herokuapp.com/trips`
url: function() {
  console.log(this);
  return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get("id");
}
}); //end const Trip

export default Trip;
