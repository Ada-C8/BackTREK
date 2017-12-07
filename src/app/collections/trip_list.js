import Backbone from 'backbone';
import _ from 'underscore';
//collection needs to know what model it contains
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  comparator: 'name', //sort by title by default
  filterSearch: function filterSearch(letters, selectedHeader) {
    console.log('In filterSearch');
    console.log(`Current letters: ${letters}`);
    console.log(`Current selectedHeader: ${selectedHeader}`);
    console.log(this);

    const filteredList = this.filter(function(trip) {

      if (selectedHeader === 'cost' || selectedHeader === 'weeks'){
        console.log('in cost/weeks');
        let value = parseFloat(letters);
        return value >= trip.get(selectedHeader);
      } else {
        console.log(`In filteredList func:`);
        console.log(trip.get(selectedHeader));
        return trip.get(selectedHeader).toLowerCase().includes(letters.toLowerCase());
      }
    });

    return new TripList(filteredList);
  },
});

export default TripList;
