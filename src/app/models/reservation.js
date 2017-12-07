import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({

  // baseUrl: "https://ada-backtrek-api.herokuapp.com/trips/",
  // tripIdAttribute: this.get('trip_id'),
  //QUESTION: can I access trip_id in here and have it be differnt for each model? Or do I need to have a more complex function to set the url that takes an argument (the trip_id) and then I can set it for each instance of the model before I call .save()?
  urlRoot() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('trip_id')}/reservations`
  }, // urlRoot

  validate(attributes) {
    const errors = {};
    
    if (!attributes.name) {
      errors.name = ['cannot be blank!'];
    }

    if (!attributes.email) {
      errors.email = ['cannot be blank!'];
    }

    // if there are no errors
    if (Object.keys(errors).length < 1) {
      return false;
    }

    // if there are errors
    return errors;
  }
});

export default Reservation;
