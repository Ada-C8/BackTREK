import Backbone from 'backbone';

// const URL = 'https://ada-backtrek-api.herokuapp.com/trips'

// const url = function url(id){
//   let url = URL +`/${id}`;
// };

const Trip = Backbone.Model.extend({
  // model: Trip,
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  toString() {
    return `<Trip ${this.get('name')}>`;
  },
  validate(attributes) {
    const errors = {};
    const CONTINENTS = ['Asia', 'Africa', 'Australasia', 'Europe', 'South America', 'North America', 'Antartica', 'asia', 'africa', 'australasia', 'europe', 'south america', 'north america', 'antartica'];
    if (!attributes.name) {
      errors.name = [' cannot be blank'];
    }

    if (!attributes.category) {
      errors.category = [' cannot be blank'];
    }

    if (!attributes.continent) {
      errors.continent = [' cannot be blank'];
    }

    if (!CONTINENTS.includes(attributes.continent)){
      errors.continent = [' is not included in the list'];
    }

    if (!attributes.weeks) {
      errors.weeks = [' cannot be blank'];
    } else if (Number.isInteger(attributes.weeks))  {
      errors.weeks = ['  is not a number'];
    }

    if (!attributes.cost) {
      errors.cost = [' cannot be blank'];
    } else if (Number.isInteger(attributes.weeks)) {
      errors.cost = ['  is not a number'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});


export default Trip;
