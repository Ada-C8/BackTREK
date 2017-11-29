import Backbone from 'backbone';

// 1. Define Model and give it a name
const Trip = Backbone.Model.extend({
  // custom code; we are going to use Book as a class; so we can get an instance of Model Book
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  idAttribute: "id",
});

// Makes sure when book.js is imported, they get Book automatically
// You can export different things in a file, but it is best practice to export 1 thing per file.
export default Trip;
