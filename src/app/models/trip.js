import Backbone from 'backbone';
import _ from 'underscore';
import Reservation from './reservation';

// 1. Define Model and give it a name
const Trip = Backbone.Model.extend({

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  idAttribute: "id",
  reserve(details) {
    const attrs = _.extend(details, {trip:this});
    const reservation = new Reservation(attrs);
    return reservation;
  }
});

export default Trip;
