import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  validate(attributes) {
    //    validates :name, presence: true, uniqueness: true
    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Cannot be blank'];
    }
    if (!attributes.continent) {
      errors['continent'] = ['Cannot be blank'];
    } else if (!continents.includes(attributes.continent)) {
      errors['continent'] = ['Must be a continent'];
    }
    if (!attributes.category) {
      errors['category'] = ['Cannot be blank'];
    }
    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    } else if (attributes.weeks <= 0) {
      errors['weeks'] = ['Trip must be for a length of time'];
    } else if (isNaN(attributes.weeks)) {
      errors['weeks'] = ['Must be a number'];
    }
    if (!attributes.cost) {
      errors['cost'] = ['Cannot be blank'];
    } else if (attributes.cost <= 0) {
      errors['cost'] = ['Trip cannot be free'];
    } else if (isNaN(attributes.cost)) {
      errors['cost'] = ['Must be a number'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
