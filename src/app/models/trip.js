import Backbone from 'backbone';
const Trip = Backbone.Model.extend({
  defaults: {
    name: 'Unknown'
  },
  // intitialize method (set up code that needs to be run)... use to debug 
  // initialize(attributes) {
  //   console.log(`trip initialized with name ${ this.get('name') }`);
  //   console.log(attributes);
  // },

  // custom method example
  toString() {
    // const currentYear = (new Date()).getFullYear();
    // return currentYear - this.get('publication_year');
    // or
    // return (new Date()).getFullYear() - this.get('publication_year');
    return `<This trip is named ${ this.get('name') }>`;
  }
});

export default Trip;
