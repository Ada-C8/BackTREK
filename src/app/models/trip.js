import Backbone from 'backbone';

//how to subclass one of the Backbone classes
const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
});

//makes Book available to any file that imports book.js
export default Trip;
