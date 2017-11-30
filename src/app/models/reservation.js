import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  // model: Trip,
   urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
   toString() {
     return `<Trip ${this.get('name')}>`;
   },

});

export default Trip;


`https://trektravel.herokuapp.com/trips/${id}/reservations`
