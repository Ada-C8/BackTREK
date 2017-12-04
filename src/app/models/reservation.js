import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  model: Reservation,
  defaults:{
    name: '',
  },
  urlRoot: () => {
    console.log(name);
    const tripId = this.get('tripId');
return `https://ada-backtrek-api.herokuapp.com/trips/${ tripId }/reservations`;
    // return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('tripId')}/reservations`;
  },
  initialize: function() {
    console.log(this.attributes);
    this.set({ name: this.attributes.name });
  },
});

export default Reservation
