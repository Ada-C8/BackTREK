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
    } else if (Number(attributes.weeks))  {
      this.set("weeks", Number(attributes.weeks));
    }else if (!Number(attributes.weeks)){
      errors.weeks = [`"${attributes.weeks}" is not a number`];
    }

    if (!attributes.cost) {
      errors.cost = [' cannot be blank'];
    } else if (Number(attributes.cost)) {
      this.set("cost", Number(attributes.cost));
    }else if (!Number(attributes.cost)){
      errors.cost = [`"${attributes.cost}" is not a number`];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    console.log('Client-side validations on trip failed');
    console.log(errors);
    return errors;
  },
});


export default Trip;
