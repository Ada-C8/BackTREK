import Backbone from 'backbone';

const Trip = Backbone.Model.extend ({
  defaults: {
    name: 'A trip into the Unknown',
    cost: 'Unknown',
    weeks: 'Unknown',
    continent: 'Unknown',
    about: 'An exciting surprise!',
    category: 'Unknown'
  },
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  idAttribute: 'id',
});

export default Trip;
