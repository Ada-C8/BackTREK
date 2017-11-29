import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: `https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations`,
  // custom code
});

export default Trip;
