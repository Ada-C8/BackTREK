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
    // console.log(`Current tripList JSON: ${this.toJSON()}`);
    console.log(`Current tripList no JSON: ${this}`);
    console.log(this);

    // const filter = _.filter(this, function(model){
    //   console.log('Model:');
    //   console.log(model);
    //   console.log(this);
    //   return model.get(selectedHeader).includes(letters); });
    //
    // return new TripList(filter);

    const filteredList = this.filter(function(trip) {

      if (selectedHeader === 'cost' || selectedHeader === 'weeks'){
        console.log('in cost/weeks');
        let value = parseFloat(letters);
        return value >= trip.get(selectedHeader);
      } else {
        console.log(`In filteredList func:`);
        console.log(trip.get(selectedHeader));
        return trip.get(selectedHeader).toLowerCase().includes(letters.toLowerCase());
         // trip.attributes.selectedHeader.includes(letters);
         // const selectedHeaderList = trip.attributes.name(selectedHeader);
         //
         // selectedHeaderList.forEach(())

      }
    });

    return new TripList(filteredList);
  },
});


    // let names = this.pluck('name');
    // console.log(`names array: ${names}`);
    // let word = names.filter(word => word.match(`/${letters}/`));
    // console.log(word);


  //
  // filterTrips(filters) {
  //     console.log(`In trip_list:`);
  //     console.log(filters);
  //     // const FIELDS = ['continent', 'weeks', 'name', 'cost', 'category']
  //     let TRIPFIELDS = Object.keys(filters)
  //     console.log('TRIPFIELDS:');
  //     console.log(TRIPFIELDS);
  //
  //     let filteredTrips = this;
  //
  //     if(!TRIPFIELDS.includes('add')) {
  //       filteredTrips = this.filter((model) => {
  //         let matched = true
  //         TRIPFIELDS.forEach((field) => {
  //           if(filters[field] != "") {
  //             if(field == 'weeks' || field== 'cost') {
  //               if(model.get(field) > parseInt(filters[field]) ) {
  //                 matched = false
  //               }
  //             }
  //             else {
  //               if(!model.get(field).toLowerCase().includes(filters[field].toLowerCase())) {
  //                 matched = false
  //               }
  //             }
  //           } //if
  //         });//forEach
  //         return matched
  //       });  //function
  //     }
  //     return filteredTrips
  //   }, //f

  // filterSearch: function filterSearch(letters, selectedHeader) {
  //   console.log('In filterSearch');
  //   console.log(`Current letters: ${letters}`);
  //   console.log(`Current selectedHeader: ${selectedHeader}`);
  //
  //   console.log(`Current tripList?: ${this.toJSON()}`);
  //   console.log(`Current tripList?: ${this}`);
  //   let tripListArray = this.toJSON();
  //
  //   tripListArray.forEach(function(trip) {
  //     console.log(`trip: ${trip}`);
  //     console.log(trip);
  //     console.log(`name: ${trip.name}`);
  //   });
  //
  //   let names = this.pluck('name');
  //   console.log(`names array: ${names}`);
  //   let word = names.filter(word => word.match(`/${letters}/`));
  //   console.log(word);
  //

// filterBy: function(field, value) {
//     const newList = this.filter(function(trip) {
//       if (['cost', 'weeks'].includes(field)){
//         value = parseFloat(value);
//         return value >= trip.get(field);
//       } else {
//         return trip.get(field).includes(value);
//       }
//     });
//     return new TripList(newList);
//   },

export default TripList;
