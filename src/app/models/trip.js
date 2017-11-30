import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  url: function() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.id}`
  }
  // url: `https://ada-backtrek-api.herokuapp.com/trips/${id}`
  // url: `https://ada-backtrek-api.herokuapp.com/trips/`
});

export default Trip;
