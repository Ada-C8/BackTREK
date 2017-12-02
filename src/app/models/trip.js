import Backbone from 'backbone';
const Trip = Backbone.Model.extend({
  // defaults: {
  //  name: 'Unknown'
  // },
  validate(attributes) {
    // not calling this.get
    // format of errors, same as rails!
    // {
    //   name: ['cannot be blank', 'already taken'],
    //   category: ['cannot be blank'],
    //   continent: ['cannot be blank']
    // }
    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }
    if (!attributes.category) {
      errors.category = ['cannot be blank'];
    }
    if (!attributes.continent)  {
      errors.continent = ['cannot be blank'];
    }
    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    }
    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    }
    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
  // intitialize method (set up code that needs to be run)... use to debug
  // initialize(attributes) {
  //   console.log(`trip initialized with name ${ this.get('name') }`);
  //   console.log(attributes);
  // },

  // custom method example
  toString() {
    // const currentYear = (new Date()).getFullYear();
    // return currentYear - this.get('publication_year');
    // or
    // return (new Date()).getFullYear() - this.get('publication_year');
    return `<This trip is named ${ this.get('name') }>`;
  }
});

export default Trip;
