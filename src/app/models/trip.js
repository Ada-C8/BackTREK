import Backbone from 'backbone';

// 1. Define Model and give it a name
const Trip = Backbone.Model.extend({

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  idAttribute: "id",
});

export default Trip;
