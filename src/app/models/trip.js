import Backbone from 'backbone'

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // urlRoot() {
  //   return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('id') }`;
  // },
  toString() {
    return `<Trip id:${this.get("id")},name:${this.get("name")},continent:${this.get("continent")}, weeks:${this.get("weeks")}, cost:${this.get("cost")}, about:${this.get("about")}  >`;
  },
  validate(attributes) {
    // Note the argument. We will read attribute values from
    // here instead of calling this.get()

    // Format of errors: same as Rails!
    // {
    //   title: ['cannot be blank', 'already taken'],
    //   author: ['cannot be blank']
    // }

    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.continent) {
      errors.continent = ['cannot be blank'];
    }

    if (!attributes.category) {
      errors.category = ['cannot be blank'];
    }

    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    }

    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    }


    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

});

export default Trip;
