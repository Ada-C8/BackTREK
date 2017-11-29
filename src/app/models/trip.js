import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://trektravel.herokuapp.com/trips/',
});

export default Trip;
