import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  // parse: function(response) {
  //   return response['trips'];
  // },
  comparator: 'name',

  filterTrips(filters) {
    console.log(filters);
    // const FIELDS = ['continent', 'weeks', 'name', 'cost', 'category']
    let TRIPFIELDS = Object.keys(filters)
    console.log(TRIPFIELDS);

    let filteredTrips = this;

    if(!TRIPFIELDS.includes('add')) {
      filteredTrips = this.filter((model) => {
        let matched = true
        TRIPFIELDS.forEach((field) => {
          if(filters[field] != "") {
            if(field == 'weeks' || field== 'cost') {
              if(model.get(field) > parseInt(filters[field]) ) {
                matched = false
              }
            }
            else {
              if(!model.get(field).toLowerCase().includes(filters[field].toLowerCase())) {
                matched = false
              }
            }
          } //if
        });//forEach
        return matched
      });  //function
    }
    return filteredTrips
  }, //f

});

export default TripList;
