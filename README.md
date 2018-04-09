# ember-ic-you

ember-ic-you is a simple scroll listener that sends an action when the element is in view.

See a demo here: [http://vestorly.github.io/ember-ic-you](http://vestorly.github.io/ember-ic-you)

### Installation
------------------------------------------------------------------------------

Via `ember install`
```
ember install ember-ic-you
```

Via NPM
* `git clone http://vestorly.github.io/ember-ic-you`
* `cd ember-ic-you`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

### Usage
------------------------------------------------------------------------------

At a basic level, you can use the listener in any template.

```
// template.hbs

{{ember-ic-you}}

// containing component or route (or controller)

actions: {
  crossedTheLine(above) {
    // do lots of cool stuff
  }
}

```

### Advanced

ember-ic-you is customizable!

* `crossedTheLine` - action that is sent when the line is crossed
  * default: `'crossedTheLine'`

* `enabled` - whether the listeners should be enabled
  * default: `true`

* `triggerDistance` - the distance from the bottom at which `crossedTheLine` fires
  * default: `0`

* `scrollContainer` - selector for the container that will be scrolled
  * default: `null` (will select `window`)

* `scrolledContent` - (optional) selector for the content that will be scrolled if the `scrollContainer` is NOT `window`
  * default: `null`
------------------------------------------------------------------------------

### Running dummy app
* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).
