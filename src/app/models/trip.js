import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // fetchContinent: function (continent, options) {
  //   options = options || {};
  //   if (options.url === undefined) {
  //     options.url = this.urlRoot +  "/continent?query=" + continent;
  //   }
  //
  //   return Backbone.Model.prototype.fetch.call(this, options);
  // },


  validate(attributes){
    const errors = {};
    const Continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
    if(!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if(!attributes.category) {
      errors.category = ['cannot be blank'];
    }

    if(!attributes.continent) {
      errors.continent = ['cannot be blank'];
    }
    if(!Continents.includes(attributes.continent)){
      errors.continents = ['Must be a continent'];
    }
    if (!attributes.weeks){
      errors.weeks = ['cannot be blank'];
    }else if(Number(attributes.weeks)){
      this.set('weeks', Number(attributes.weeks));
    }else if(!Number(attributes.weeks)){
      errors.weeks = ['cannot be blank'];
    }
    if (!attributes.cost){
      errors.cost = ['cannot be blank'];
    }else if(Number(attributes.cost)){
      this.set('cost', Number(attributes.cost));
    }else if(!Number(attributes.cost)){
      errors.cost = ['cannot be blank'];
    }

    if(Object.keys(errors).length < 1){
      return false;
    }
    return errors;
  },
});

export default Trip;
