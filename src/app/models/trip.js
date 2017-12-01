import Backbone from 'backbone';

const Trip = Backbone.Model.extend({

  validate(attributes) {
    const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America']

    const errors = {};

    if (!attributes.name) {
      errors.title = ['cannot be blank'];
    }
    if (!CONTINENTS.includes(attributes.continent)){
      errors.continent = ["that isn't a continent"];
    }
    if (!attributes.continent){
      errors.continent = ['cannot be blank'];
    }
    if (!attributes.about) {
      errors.about = ['cannot be blank'];
    }
    if (!attributes.category) {
      errors.category = ['cannot be blank'];
    }
    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    }
    if (attributes.weeks <= 0) {
      errors.weeks = ['trips must be greater than one week in length'];
    }
    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    }
    if (attributes.cost <= 0) {
      errors.cost = ['A trips cost must be greater than 0'];
    }
  }
});


export default Trip;
