import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',

  validate(attributes) {
   const errors = {};
   if (!attributes.name) {
     errors.name = ['Name must not be blank'];
   }

   if (!attributes.continent) {
     errors.continent = ['Continent must not be blank'];
   }

   if (!attributes.about) {
     errors.about = ['About must not be blank'];
   }

   if (!attributes.category) {
     errors.category = ['Category must not be blank'];
   }

   if (!attributes.weeks) {
     errors.weeks = ['Weeks must not be blank'];
   } else if (attributes.weeks < 0) {
   errors.weeks = ['Weeks must be greater than 0'];
   }

   if (!attributes.cost) {
     errors.cost = ['Cost must not be blank'];
   }else if (attributes.cost <0) {
     errors.cost = ['Cost must not be negative']
   }

   if (Object.keys(errors).length < 1) {
     return false;
   }
   return errors;
 },

});

export default Trip;
