import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  validate: function(attributes) {
    const errors = {};
    const rezFields = ['name', 'age', 'email'];
  }
});
