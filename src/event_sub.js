// EventSub
//
// Usage:
//
// const Events = new EventSub();
// Events.subscribe('app_loaded', ()=>{
//  App.init();
// });
// Events.publish('app_loaded');
//

// Pluggable Logger: {
class EventSub {
  constructor() {
    this.subscriptions = new Map();
    this.logger;
  }

  clear() {
    this.subscriptions.clear();
  }

  subscribe(event, listener) {
    if (this.logger) {
      this.logger("SUBSCRIBE", { event: event, listener: listener });
    }
    if (!listener) {
      throw new Error("listener not defined.");
    }
    let listeners;
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, []);
    }
    listeners = this.subscriptions.get(event);
    let index = listeners.push(listener) - 1;

    return {
      unsubscribe: () => {
        if (this.logger) {
          this.logger("UNSUBSCRIBE", { event: event, index: index });
        }
        if (this.subscriptions.get(event)[index]) {
          delete this.subscriptions.get(event)[index];
        }
      }
    };
  }

  publish(event, payload) {
    if (this.logger) {
      this.logger("PUBLISH", { event: event, payload: payload });
    }
    let listeners = this.subscriptions.get(event);
    listeners.forEach(listener => {
      if (this.logger) {
        this.logger("FIRE", { event: event, payload: payload });
      }
      listener(payload);
    });
  }
}

export { EventSub };
