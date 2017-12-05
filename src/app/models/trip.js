import Backbone from 'backbone';

const Trip = Backbone.Model.extend({

  validate(attributes) {
    // const CONTINENTS = ['africa', 'antartica', 'asia', 'australasia', 'europe', 'north america', 'south america']

    const errors = {};

    if (!attributes.name) {
      errors.name = ['cannot be blank!'];
    }

    // if (!CONTINENTS.includes(attributes.continent.toLowerCase())){
    //   errors.continent = ["that isn't a continent"];
    // }

    if (!attributes.continent){
      errors.continent = ['cannot be blank'];
    }

    if (!attributes.about) {
      errors.about = ['cannot be blank'];
    }

    if (!attributes.category) {
      errors.category = ['cannot be blank'];
    }

    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    }

    if (attributes.weeks <= 0) {
      errors.weeks = ['trips must be greater than one week in length'];
    }

    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    }

    if (attributes.cost <= 0) {
      errors.cost = ['A trips cost must be greater than 0'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  }
});


export default Trip;
