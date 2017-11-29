import Backbone from 'backbone';

const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

// const url = function url(id){
//   let url = URL +`/${id}`;
// };

const Trip = Backbone.Model.extend({
  // model: Trip,
   urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
   toString() {
     return `<Trip ${this.get('name')}>`;
   },

});

export default Trip;
