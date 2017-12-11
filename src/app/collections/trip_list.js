import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  comparator: 'name',
  fetchContinent: function (apiSearch, options) {
    options = options || {};
    $('#api-query').html('');
    $('#api-query').append(apiSearch.myValue);
    if (options.url === undefined) {

      options.url = this.url +  "/" + apiSearch.queryType + "?query=" + apiSearch.myValue;
    }
    return Backbone.Model.prototype.fetch.call(this, options);
  },

  // fetchCost: function (cost, options) {
  //   options = options || {};
  //   $('#continent').html('');
  //   $('#continent').append(continent.myValue);
  //   if (options.url === undefined) {
  //     options.url = this.url +  "budget?query=" + continent.myValue;
  //   }
  //   return Backbone.Model.prototype.fetch.call(this, options);
  //   console.log('this');
  // },
});






export default TripList;
