import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  baseUrl: 'https://ada-backtrek-api.herokuapp.com/trips/',
  url: function() {
    const url = this.baseUrl + this.id;
    return url;
  },
});

export default Trip;
