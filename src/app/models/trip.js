import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    return response
  },
  initialize: function(attributes) {
    // console.log(`in initializer for the trip ${ this.get('title')}`);
    // console.log(attributes);
  },
  validate: function(attributes) {
    console.log(attributes);
    const errors = {};

    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America']


    //TODO: should add to keys array, not replace?
    if (!attributes.name) {
      errors['name'] = ['Name cannot be blank'];
    }

    if (!attributes.continent) {
      errors['continent'] = ['continent cannot be blank'];
    } else if (!continents.includes(attributes.continent)) {
      errors['continent'] = ['continent must be from the dropdown list'];
    }

    if (!attributes.category) {
      errors['category'] = ['category cannot be blank'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['weeks cannot be blank'];
    } else if (isNaN(attributes.weeks)){
      errors['weeks'] = ['weeks must be number'];
    }

    if (!attributes.cost) {
      errors['cost'] = ['cost cannot be blank']
    } else if (isNaN(attributes.cost)) {
      errors['cost'] = ['cost must be a number']
    }

    console.log('errors!');
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip
