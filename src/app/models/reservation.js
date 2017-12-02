import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url: function(){
    return this.instanceUrl;
  },
  initialize: function(attributes){
    this.instanceUrl = attributes.url;
  },
  parse: function(response) {
    return response;
  },
  validate: function(attributes) {
    // console.log(this.url);
    // console.log(attributes)
    console.log('in the Reservation validate function');
    const errors = {};
  },


});

export default Reservation;
