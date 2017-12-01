import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  model: Trip,
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  initialize: function() {
      this.fetch();
    },
  defaults: {
    name: 'Unknown'
  },
});

export default Trip;
