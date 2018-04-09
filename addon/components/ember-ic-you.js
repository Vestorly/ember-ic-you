import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { run } from '@ember/runloop';
import { isBlank, isEmpty } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import jquery from 'jquery';

/**
 A simple component to send an action when it passes a distance from the bottom
 of a scrollable element.

 @class EmberICYou
 */

export default Component.extend({

  /**
    @property classNames
    @type {Array}
    @public
  */

  classNames: ['ember-ic-you'],

  /**
    The name of the action that will be sent.
    @property crossedTheLine
    @type {String}
    @public
  */

  crossedTheLine: 'crossedTheLine',

  /**
    True if the listener can be turned on.

    @property enabled
    @type {Boolean}
    @default true
  */

  enabled: true,

  /**
    The distance from the bottom at which aboveTheLine will be true.

    @property triggerDistance
    @type {Number}
    @default 0
  */

  triggerDistance: 0,

  /**
    Optional - the viewport element holding the content.

    @property scrollContainer
    @type {String}
    @default null
  */

  scrollContainer: null,

  /**
    Optional - the content that is currently being scrolled.

    @property scrolledContent
    @type {String}
    @default null
  */

  scrolledContent: null,

  /**
    The cached scroll container - used to remove listener if `scrollContainer` gets re-computed.

    @property cachedContainer
    @type {Object}
    @default null
  */

  cachedContainer: null,

  /**
    Selector for the viewport container. If null, the container will be the window.

    @property scrollContainer
    @type {String}
    @default null
  */

  _scrollContainer: computed('scrollContainer', function() {
    let selector = get(this, 'scrollContainer');
    return selector ? this.$().closest(selector) : jquery(window);
  }),

  /**
    Selector for the content being scrolled. If null, the scrolled content will be the document.

    @property _scrolledContent
    @type {String}
  */

  _scrolledContent: computed('scrolledContent', function() {
    return this.$().closest(get(this, 'scrolledContent'));
  }),

  /**
    Caches the elements that will be used in each scroll cycle, sets an observer
    on `enabled` to fire `_switch`, and calls `_switch`;

    @method didRender
  */

  didRender() {
    this.addObserver('enabled', this, '_switch');
    this._switch();
  },

  /**
    The names of the listeners the component will use, concatenated for use by
    jQuery.

    @property eventNames
    @type {String}
  */

  eventNames: computed(function() {
    let guid = guidFor(this);
    return `scroll.${guid} resize.${guid}`;
  }),

  /**
    Deactivates the jQuery listeners.

    @method willDestroyElement
  */

  willDestroyElement() {
    this.deactivateListeners(get(this, '_scrollContainer'));
  },

  /**
    Initializes jQuery listeners.

    @method activateListeners
  */

  activateListeners() {
    let scrollContainer = get(this, '_scrollContainer');
    let eventNames = get(this, 'eventNames');

    this.deactivateListeners(get(this, 'cachedContainer'));
    set(this, 'cachedContainer', scrollContainer);

    scrollContainer.on(eventNames, () => {
      this._listenerFired();
    });
  },

  /**
    Deinitializes jQuery listeners.

    @method deactivateListeners
  */

  deactivateListeners(container) {
    if (isBlank(container)) { return; }
    set(this, 'cachedContainer', null);

    container.off(get(this, 'eventNames'));
  },

  /**
    Activates and deactivates listeners depending on if the component is `enabled`

    @method _switch
    @private
  */

  _switch() {
    let enabled = get(this, 'enabled');

    if (enabled) {
      this.activateListeners();
    } else {
      this.deactivateListeners(get(this, '_scrollContainer'));
    }
  },

  /**
    Measures the distance of the component from the bottom.
    Debounces `crossedTheLine` action.

    @method _listenerFired
    @private
  */

  _listenerFired() {
    let scrollContainer = get(this, '_scrollContainer');
    let scrolledContent = get(this, '_scrolledContent');
    let triggerDistance = get(this, 'triggerDistance');

    let icYouWindowPosition = this.$().offset().top;

    // If you are scrolling content that isn't the window itself, there should be a provided `scrolledContent` selector
    // for that content. The position of `ember-ic-you` would be measured relative to this scrolled content.
    let offsetFromTop = isEmpty(scrolledContent) ? icYouWindowPosition : icYouWindowPosition - scrolledContent.offset().top;
    let scrollContainerPosition = scrollContainer.scrollTop();
    let scrollContainerHeight = scrollContainer.height();

    let positionOfMe = offsetFromTop - scrollContainerPosition - scrollContainerHeight;
    let scrolledPassedTrigger = ( positionOfMe <= triggerDistance );

    if (scrolledPassedTrigger) {
      run.debounce(this, 'sendAction', 'crossedTheLine', scrolledPassedTrigger, 25);
    }
  }
});
