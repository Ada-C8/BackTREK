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
});

export default Trip;
