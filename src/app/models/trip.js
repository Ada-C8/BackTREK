import Backbone from 'backbone';

//how to subclass one of the Backbone classes
const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

//VALIDATIONS

//   validates :category, presence: true
//   validates :weeks, presence: true, numericality: { greater_than: 0 }
//   validates :cost, presence: true, numericality: { greater_than: 0 }

validate(attributes) {
  console.log(`attributes: ${attributes}`);
  const errors = {};

  if (!attributes.name) {
    errors.name = ['cannot be blank'];
  }

  // tripList.forEach(function(trip) {
  //   if(attributes.name === trip.name) {
  //     errors.name = ['must be unique']
  //   }
  // });

  if (!attributes.continent) {
    errors.continent = ['cannot be blank'];
  }

  () => {
    const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America']
    CONTINENTS.forEach(function(continent) {
      console.log(attributes.continent);
      if(attributes.continent == continent) {
        return true
      }
    });
    errors.continent = ['must be included in list of continent']
  }

  if (!attributes.category) {
    errors.category = ['cannot be blank'];
  }


  if (!attributes.weeks) {
    errors.weeks = ['cannot be blank'];
  } else if (typeof attributes.weeks != 'number'  ||
  attributes.weeks < 0)  {
    errors.weeks = ['must be a number greater than 1'];
  }

  if (!attributes.cost) {
    errors.cost = ['cannot be blank'];
  } else if (typeof attributes.cost != 'number'  ||
  attributes.cost < 0)  {
    errors.cost = ['must be a number greater than 1'];
  }

  if (Object.keys(errors).length < 1) {
    return false;
  }
  return errors;
}

});


//makes Book available to any file that imports book.js
export default Trip;
