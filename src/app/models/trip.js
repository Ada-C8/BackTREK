import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  defaults: {
    name: 'Untitled Trip',
    continent: 'Unknown',
    category: 'none',
    weeks: 0,
    about: 'no info',
    cost: 0,
  },
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',

  validate(attr) {
    const errors = {};
    if (!['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'].includes(attr['continent'])) {
      errors['continent'] = 'must be valid Earth continent';
    }
    ['weeks', 'cost'].forEach((field) => {
      if (parseFloat(attr[field]) === NaN) {
        errors[field] = "must be a number";
      }
      if (!parseFloat(attr[field]) > 0) {
        errors[field] = "must be greater than 0";
      }
    });
    ['name', 'continent', 'category', 'weeks', 'cost'].forEach((field) => {
      if (attr[field] === '') {
        errors[field] = "can't be blank";
      }
    });
    return Object.keys(errors).length > 0 ? errors : false;
  },
});

export default Trip;
