
import Backbone from 'backbone';

const ContinentQuery = Backbone.Model.extend({
  urlPrefix: 'https://ada-backtrek-api.herokuapp.com/trips/continent?query=',
  // tripId: model.attributes.id,
  url: function() {
    let continentQueryUrl = this.urlPrefix;
    continentQueryUrl += this.attributes.continent
    return continentQueryUrl;
  },

  validate(attributes) {
    const errors = {};
    if(!attributes.continent) {
      errors.name = ['cannot be blank'];
    }
    if(Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },
});

export default ContinentQuery;
