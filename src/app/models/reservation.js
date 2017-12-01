import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({

  validate: function(attributes) {
    console.log('What are the attributes in validate');
    console.log(attributes);
  },

});

export default Reservation;
