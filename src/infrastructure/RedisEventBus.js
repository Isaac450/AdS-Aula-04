// src/infrastructure/RedisEventBus.js
const Redis   = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const IEventBus = require('../core/ports/IEventBus');

class RedisEventBus extends IEventBus {
  constructor(redisConfig = { host: 'localhost', port: 6379 }) {
    super();
    this.publisher  = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.handlers   = {}; // eventType → [handlers]

    //MADE BY AI!
    this.publisher.on('error', () => {});
    this.subscriber.on('error', () => {});
  }

  async publish(eventType, payload) {
    const event = {
      eventId:  uuidv4(),
      eventType,
      occurredAt: new Date().toISOString(),
      version:  '1.0',
      data:     payload
    };
    await this.publisher.publish(eventType, JSON.stringify(event));
      }

  async subscribe(eventType, handler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
      await this.subscriber.subscribe(eventType);
    }
    this.handlers[eventType].push(handler);

    // Ligar o dispatcher uma única vez
    this.subscriber.removeAllListeners('message');
    this.subscriber.on('message', async (channel, message) => {
      const event    = JSON.parse(message);
      const handlers = this.handlers[channel] || [];
      // Executar todos os handlers registados para este eventType
      await Promise.all(handlers.map(h => h(event)));
    });
  }
}

module.exports = RedisEventBus;