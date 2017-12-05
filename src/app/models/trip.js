import Backbone from 'backbone';

const Trip = Backbone.Model.extend({

  validate(attributes) {
    const CONTINENTS = ['africa', 'antartica', 'asia', 'australasia', 'europe', 'north america', 'south america']

    const errors = {};

    if (!attributes.name) {
      errors.title = ['Error: blank'];
    }

    if (!attributes.continent){
      errors.continent = ['Error: blank'];
    }

    if (!attributes.about) {
      errors.about = ['Error: blank'];
    }

    if (!attributes.category) {
      errors.category = ['Error: blank'];
    }

    if (!attributes.weeks) {
      errors.weeks = ['Error: blank'];
    }

    if (attributes.weeks <= 0) {
      errors.weeks = ['Trips must be 1+ weeks long'];
    }

    if (!attributes.cost) {
      errors.cost = ['Error: blank'];
    }

    if (attributes.cost <= 0) {
      errors.cost = ['Trips cost money! More than 0 dollars'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  }
});


export default Trip;
