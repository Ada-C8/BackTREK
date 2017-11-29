// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
// let tripTemplate;

// const allTrips= () => {
//   const tripsTable = `<h2>All Trips</h2>
//     <table>
//       <thead>
//         <th class="sort id">ID</th>
//         <th class="sort name">name</th>
//         <th class="sort continent">Continent</th>
//         <th class="sort category">Category</th>
//         <th class="sort weeks">Weeks</th>
//         <th class="sort cost">Cost</th>
//       </thead>
//       <tbody id="trip-list">
//       </tbody>
//     </table>`;
//   $('#all-trips').append(tripsTable);
//   render(tripList);
// };

// const tripInfo= () => {
//   console.log('called TripInfo');
//   console.log(this);
// };
const events = {
  allTrips(event) {
    $('#all-trips').empty();
    const tripsTable = `<h2>All Trips</h2>
      <table>
        <thead>
          <th class="sort id">ID</th>
          <th class="sort name">name</th>
          <th class="sort continent">Continent</th>
          <th class="sort category">Category</th>
          <th class="sort weeks">Weeks</th>
          <th class="sort cost">Cost</th>
        </thead>
        <tbody id="trip-list">
        </tbody>
      </table>`;
    $('#all-trips').append(tripsTable);
    render(tripList);
  },
  tripInfo(event) {
    console.log('called TripInfo');
    console.log(this.id);
    const trip = new Trip({id: this.id});

    trip.fetch({
      success: function (trip,response) {
        // trip is the Backbone model instance, response is the JSON object
        $('#trip-details').empty();
        $('#trip-details').append(showTemplate(trip.attributes));
      },
    })

    // trip.fetch({
    //   success: function(){
    //     $('#content').html(new usersView({
    //       collection: users
    //     }).render().el);
    //   },
    // });

  },
};
const render= function render(tripList) {
  $('#trip-list').empty();
  tripList.fetch();
  tripList.forEach((trip) => {
    const tripCost= (trip.attributes.cost);
    trip.set('cost', tripCost.toFixed(2));
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};
let tripTemplate;
let showTemplate;
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  showTemplate = _.template($('#show-template').html());
  // $('#all-trips-btn').on('click', () => {
  //   allTrips();
  // });
  $('#all-trips-btn').click(events.allTrips);
  $('#all-trips').on('update', render);
  $('#all-trips').on('click', 'tr', events.tripInfo);
});
