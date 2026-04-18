// src/core/ports/IEventBus.js

class IEventBus {
  // Publica um evento para todos os subscritores deste eventType
  async publish(eventType, payload) { throw new Error('Not implemented'); }

  // Regista um handler para reagir a um eventType específico
  async subscribe(eventType, handler) { throw new Error('Not implemented');
}
}

module.exports = IEventBus;