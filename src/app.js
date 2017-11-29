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

const showAllTrips= () => {
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
    </table>
</section>`;
  $('#all-trips').append(tripsTable);
};

const events = {
  showAllTrips(event){
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
    const table =
    $('#all-trips').append(tripsTable);
    render(tripList);
  },

}
const render= function render(tripList) {
  $('#trip-list').empty();
  tripList.forEach((trip) => {
    const tripCost= (trip.attributes.cost);
    trip.set('cost', tripCost.toFixed(2));
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};
let tripTemplate;
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.fetch();
  // $('#all-trips-btn').on('click', () => {
  //   showAllTrips();
  // });
  $('#all-trips-btn').click(events.showAllTrips);
  $('#all-trips').on('update', render);

});
