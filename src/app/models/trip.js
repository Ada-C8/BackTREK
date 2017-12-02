import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  validate: function(attributes) {
    console.log('the attributes of this trip are as follows:');
    console.log(attributes);
    const errors = {};
    const continents = ['africa', 'antartica', 'asia', 'australasia', 'europe', 'north america', 'south america'];
    const numericFields = ['weeks', 'cost'];

    // const initializeArrays = (field, inputHash) => {
    //   if (!inputHash[field]) {
    //     inputHash[field] =[];
    //   }
    // };

    if (!attributes.name) {
      if (!errors['name']) {
        errors['name'] = [];
      }
      // initializeArrays('name', errors);
      errors['name'].push('Trip must have a name');
    }

    if (!attributes.continent) {
      if (!errors['continent']) {
        errors['continent'] = [];
      }
      errors['continent'].push('Trip must have a continent.Continent must be one of the following: Africa, Antartica, Asia, Australasia, Europe, North America, or South America');
    } else if (!continents.includes(attributes.continent.toLowerCase())) {
      if (!errors['continent']) {
        errors['continent'] = [];
      }

      errors['continent'].push('Continent must be one of the following: Africa, Antartica, Asia, Australasia, Europe, North America, or South America.');
    }

    if (!attributes.category) {
      if (!errors['category']) {
        errors['category'] = [];
      }
      errors['category'].push('Trip must have a category');
    }

    if (!attributes.about) {
      if (!errors['about']) {
        errors['about'] = [];
      }
      // initializeArrays('about', errors);
      errors['about'].push('Trip must have a name');
    }

    if (!attributes.weeks) {
      if (!errors['weeks']) {
        errors['weeks'] = [];
      }
      errors['weeks'].push('Number of weeks must be included');
    }

    if (isNaN(attributes.weeks)) {
      if (!errors['weeks']) {
        errors['weeks'] = [];
      }
      errors['weeks'].push('Number of weeks must be a valid number');
    } else if (parseInt(attributes.weeks) <= 0) {
      if (!errors['weeks']) {
        errors['weeks'] = [];
      }
      errors['weeks'].push('Number of weeks must be greater than 0');
    }

    if (!attributes.cost) {
      if (!errors['cost']) {
        errors['cost'] = [];
      }
      errors['cost'].push('Cost must be included');
    }

    if (isNaN(attributes.cost)) {
      if (!errors['cost']) {
        errors['cost'] = [];
      }
      errors['cost'].push('Cost must be a valid price');
    } else if (parseInt(attributes.cost) <= 0) {
      if (!errors['cost']) {
        errors['cost'] = [];
      }
      errors['cost'].push('Cost must be greater than 0');
    }

    // numericFields.forEach((numField) => {
    //   if (!attributes[numField]) {
    //     if (!errors[numField]) {
    //       errors[numField] = [];
    //     }
    //     errors[numField].push(`${numField} must be included`);
    //   }
    //
    //   if (isNaN(attributes[numField])) {
    //     if (!errors[numField]) {
    //       errors[numField] = [];
    //     }
    //     errors[numField].push(`${numField} must be a valid number`);
    //   } else if (parseInt(attributes[numField]) <= 0) {
    //     if (!errors[numField]) {
    //       errors[numField] = [];
    //     }
    //     errors[numField].push('Cost must be greater than 0');
    //   }
    // })

    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return errors;
    } else {
      return false;
    }
  },

});

export default Trip;
