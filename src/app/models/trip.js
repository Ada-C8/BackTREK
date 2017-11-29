import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',


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
    } else if (attributes.weeks <= 0) {
      errors.weeks = ['must be greater than zero'];
    }

    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    } else if (attributes.cost <= 0) {
      errors.cost = ['must be greater than zero'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

  // has_many :trip_reservations
  //
  // validates :name, presence: true, uniqueness: true
  // validates :continent, presence: true, inclusion: { in: CONTINENTS }
  // validates :category, presence: true
  // validates :weeks, presence: true, numericality: { greater_than: 0 }
  // validates :cost, presence: true, numericality: { greater_than: 0 }
});


export default Trip;
