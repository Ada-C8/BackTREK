import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  defaults: {
    name: 'Untitled Trip',
    continent: 'Unknown',
    category: 'none',
    weeks: 0,
    about: 'no info',
    cost: 0,
  },
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
});

export default Trip;
