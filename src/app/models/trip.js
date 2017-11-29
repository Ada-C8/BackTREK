import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  url: function(){
    let url = this.urlRoot + this.id
    return url
  }
});

export default Trip
