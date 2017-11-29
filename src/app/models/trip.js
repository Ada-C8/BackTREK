import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  url: `https://ada-backtrek-api.herokuapp.com/trips/1`
});

export default Trip;
