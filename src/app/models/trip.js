import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  defaults: {

    },

  validate: function(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors['name'] = ['Cannot be blank'];
    }
    if (!attributes.continent) {
      errors['continent'] = ['Cannot be blank'];
    }
    if (!attributes.about) {
      errors['about'] = ['Cannot be blank'];
    }
    if (!attributes.category) {
      errors['category'] = ['Cannot be blank'];
    }
    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    }
    if (!attributes.cost) {
      errors['cost'] = ['Cannot be blank'];
    }


    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
