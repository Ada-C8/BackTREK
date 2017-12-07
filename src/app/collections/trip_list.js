import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  comparator: 'name',
  fetchContinent: function (continent, options) {
    options = options || {};
    console.log(continent.myValue);
    console.log('that was continent ^^');
    if (options.url === undefined) {
      options.url = this.url +  "/continent?query=" + continent.myValue;
    }
    return Backbone.Model.prototype.fetch.call(this, options);
    console.log('this');
  },
});






export default TripList;
