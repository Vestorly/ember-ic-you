import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  actions: {
    crossedTheLine(above) {
      set(this, 'aboveTheLine', above);
    }
  }
});
