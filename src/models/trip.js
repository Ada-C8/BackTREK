import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'http://ada-backtrek-api.herokuapp.com/trips'
});
export default Trip;
