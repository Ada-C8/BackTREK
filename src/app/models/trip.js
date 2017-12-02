import Backbone from 'backbone';
import _ from 'underscore';
import Reservation from './reservation';
import TripList from '../collections/trip_list';

// 1. Define Model and give it a name
const Trip = Backbone.Model.extend({

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  idAttribute: "id",
  reserve(details) {
    const attrs = _.extend(details, {trip:this});
    const reservation = new Reservation(attrs);
    return reservation;
  },
  validate: function(attributes) {
    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];

    const errors = {};
    const tripList = new TripList;

    if (!attributes.name) {
      errors['name'] = 'cannot be blank';
    }
    // } else if (attributes.name === tripList.findWhere(attributes.name) ) {
    //   errors['name'] = 'already exists. Please choose another trip name.';
    // }

    if (!attributes.continent) {
      errors['continent'] = 'cannot be blank';
    } else if (!continents.includes(attributes.continent)) {
      errors['continent'] = `must be one of the following continents: ${continents}`;
    }

    if (!attributes.category) {
      errors['category'] = 'cannot be blank';
    }

    if (!attributes.weeks) {
      errors['weeks'] = 'cannot be blank';
    } else if (attributes.weeks < 1) {
      errors['weeks'] = 'must be greater than 0.'
    }

    if (!attributes.cost) {
      errors['cost'] = 'cannot be blank';
    } else if (attributes.cost < 1) {
      errors['cost'] = 'must be greater than 0.'
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});

export default Trip;
