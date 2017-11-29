import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  url: function() {
    return this.urlRoot + this.id;
  }
});









export default Trip;
