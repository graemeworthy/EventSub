Event Sub
=========

A basic, and tiny but inspectable pub-sub event system.

```javascript

const Events = new EventSub();
Events.subscribe('app_loaded', () => {
  App.init();
});

Events.publish('app_loaded');

```

Inspection
----------

Log events any way you want with the pluggable logger;

```javascript

const Events = new EventSub();
Events.logger = (action, details) => {
  // use any logger you want.
  console.log(action, details);
};

Events.subscribe('app_loaded', () => {
  App.init();
});

# => SUBSCRIBE, {event: 'app_loaded' }
```


loggable events: `[SUBSCRIBE, UNSUBSCRIBE, PUBLISH, FIRE]`


Singleton
---------

Use a singleton instance of the event system, so that all components can use the same events bus.

``` javascript

~ event_bus.js
import { EventSub } from 'event_sub';

export var events = new EventSub();

~ every other file;
import events from 'event_bus'

events.subscribe('loaded', ()=>{...});
events.publish('your fancy event')


```
