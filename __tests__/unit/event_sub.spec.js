import { EventSub } from "src/event_sub.js";

describe("EventSub", () => {
  var EventSystem;
  beforeAll(() => {
    EventSystem = new EventSub();
    EventSystem.logger = () => {};
  });

  beforeEach(() => {
    EventSystem.clear();
  });

  it("exists", () => {
    expect(EventSub);
  });

  it("instantiates", () => {
    expect(EventSystem).toBeInstanceOf(EventSub);
  });

  describe("A Basic Loop", () => {
    var eventHandler = jest.fn();

    it("triggers once", () => {
      EventSystem.subscribe("test", eventHandler);
      EventSystem.publish("test");
      expect(eventHandler).toBeCalled();
    });

    it("triggers twice", () => {
      EventSystem.subscribe("test", eventHandler);
      EventSystem.publish("test");
      EventSystem.publish("test");
      expect(eventHandler).toBeCalledTimes(2);
    });

    it("delivers a payload", () => {
      let payload = { one: "One", two: "Two" };
      EventSystem.subscribe("test", eventHandler);
      EventSystem.publish("test", payload);
      expect(eventHandler).toBeCalledWith(payload);
    });

    it("requires a listener", () => {
      expect(() => {
        EventSystem.subscribe("test");
      }).toThrow();
    });
  });

  describe("Two Events on the same name", () => {
    var eventHandler = jest.fn();
    var secondEventHandler = jest.fn();

    it("binds a name and calls it", () => {
      EventSystem.subscribe("test", eventHandler);
      EventSystem.subscribe("test", secondEventHandler);
      EventSystem.publish("test");
      expect(eventHandler).toBeCalled();
      expect(secondEventHandler).toBeCalled();
    });
  });

  describe("Unsubscribe", () => {
    var toDelete = jest.fn();
    var toRemain = jest.fn();

    it("unbinds events upon request", () => {
      var handle = EventSystem.subscribe("test", toDelete);
      EventSystem.subscribe("test", toRemain);
      handle.unsubscribe();
      EventSystem.publish("test");
      expect(toDelete).not.toBeCalled();
      expect(toRemain).toBeCalled();
    });
  });

  describe("Logging", ()=>{
    var logger = jest.fn();
    var fake = () => {};
    
    it('logs subscriptions', ()=> {
      EventSystem.logger = logger;
      EventSystem.subscribe("test", fake);
      expect(logger).toBeCalledWith("SUBSCRIBE", {event: "test", listener: fake});
    })
    
    it('logs publications', ()=> {
      EventSystem.subscribe("test", fake);
      EventSystem.logger = logger;
      EventSystem.publish("test");
      expect(logger).toBeCalledWith("PUBLISH", {event: "test"});
    })
    
    it('logs publications payloads', ()=> {
      var fakePayload = {one: 'One'};
      EventSystem.subscribe("test", fake);
      EventSystem.logger = logger;
      EventSystem.publish("test", fakePayload);
      expect(logger).toBeCalledWith("PUBLISH", {event: "test", payload: fakePayload});
    })

    it('logs firing payloads', ()=> {
      var fakePayload = {one: 'One'};
      EventSystem.subscribe("test", fake);
      EventSystem.logger = logger;
      EventSystem.publish("test", fakePayload);
      expect(logger).toBeCalledWith("FIRE", {event: "test", payload: fakePayload});
    })
  })  
});
