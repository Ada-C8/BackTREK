import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  comparator: 'id',
  greaterThan(field, value) {
    let models = this.select(function(model) {
      return model.get(`${field}`) > value;
    });
    return new TripList(models);
  },
  includes(field, value) {
    if (field === undefined || field === '') {
      let models = this.select(function(model) {
        const attributes = Object.keys(model.attributes);

        for (let i = 0; i < attributes.length; i += 1) {
          if (typeof model.get(attributes[i]) === 'number') {
            if (model.get(attributes[i]).toString().includes(value)) return true;
            // return model.get(attributes[i]).toString().includes(value);
          } else {
            if (model.get(attributes[i]).toLowerCase().includes(value.toLowerCase())) return true;
          }
        }
        return false;
      });
      return new TripList(models);
    } else {
      let models = this.select(function(model) {
        return model.get(`${field}`).toLowerCase().includes(value.toLowerCase());
      });
      return new TripList(models);
    }
  },
  filterBy(field, value) {
    if (field === 'cost' || field === 'weeks') return this.greaterThan(field, value);

    return this.includes(field, value);
  }
});

export default TripList;
