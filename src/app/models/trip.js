import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  // defaults: {
  // author: 'unknown',
  // },
  validate(attributes) {
    const errors = {};
    ['name', 'continent', 'category', 'weeks', 'cost'].forEach((property) => {
      if (!attributes[property]) {
        errors[property] = [`can't be blank`];
      }
    });


    // continent: is not included in the list

    // weeks: is not a number

    // cost: is not a number

    // if (attributes.publication_year < 1000 || attributes.publication_year > (new Date()).getFullYear()) {
    //   errors.publication_year = ['must be between 1000 and the current year'];
    // }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

  toString() {
    return `<Trip ${this.get('id')}: ${this.get('name')} in continent ${this.get('continent')}>`;
  },
  // parse: function(response) {
  //   console.log(response);
  // },
});


export default Trip;
