import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  initialize: function(attributes) {
  },
  validate: function(attributes) {
    const errors = {};
    const rezFields = ['name', 'age', 'email'];
  }
});
export default Reservation;
