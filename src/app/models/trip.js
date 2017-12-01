import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  defaults: {
    category: 'N/A',
    about: 'N/A',
  },
});

export default Trip;
