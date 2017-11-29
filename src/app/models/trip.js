import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  sPluralize(word, qty) {
    if (qty === 1) {
      return word;
    }
    return `${word}s`;
  },
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
});

export default Trip;
