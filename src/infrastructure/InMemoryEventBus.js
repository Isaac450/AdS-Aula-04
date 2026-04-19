const { v4: uuidv4 } = require('uuid');

class InMemoryEventBus {
  constructor() {
    this.handlers = {};
  }

  async publish(eventType, payload) {
    const event = {
      eventId: uuidv4(),
      eventType,
      occurredAt: new Date().toISOString(),
      version: '1.0',
      data: payload
    };

    const handlers = this.handlers[eventType] || [];
    await Promise.all(handlers.map(h => h(event)));
  }

  async subscribe(eventType, handler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
  }
}

module.exports = InMemoryEventBus;
