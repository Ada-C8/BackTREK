import Backbone from 'backbone';
import _underscore from 'underscore';

const Trip = Backbone.Model.extend({
  defaults: {
    category: 'everything',
  },
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  validate: function(attributes){
    const errors = {};
    console.log('in validate in Trip model');
    const tripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

    // check for blanks
    const blank_attributes = _underscore.difference(tripFields, Object.keys(attributes));
    if (blank_attributes.length > 0){
      blank_attributes.forEach((attr) => {
        attr = attr.charAt(0).toUpperCase() + attr.slice(1);
        errors[attr] = `${attr} cannot be blank.`;
      });
    }
    console.log(errors);

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});
export default Trip;
