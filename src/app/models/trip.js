import Backbone from 'backbone';

const Trip = Backbone.Model.extend ({
  // make a function using the url, add an id of the trip with concatonation.
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    return response
  }
});

export default Trip;
