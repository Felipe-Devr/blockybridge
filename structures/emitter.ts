import { ClientEventSignal } from '../structures';

class EventEmitter<T, V extends ClientEventSignal> {
  protected listeners: Map<T, Set<(event: V) => void>> = new Map();
  public readonly events: Set<V> = new Set();

  public on(event: T, listener: (event: V) => void): void {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      this.listeners.set(event, new Set([listener]));
      return;
    }
    listeners.add(listener);
  }

  public once(event: T, listener: (event: V) => void): void {
    const wrapper = (firedEvent: V) => {
      listener(firedEvent);
      this.removeListener(event, wrapper);
    };
    this.on(event, wrapper);
  }

  public removeListener(event: T, listener: (event: V) => void): void {
    const listeners = this.listeners.get(event);

    if (!listeners) return;
    listeners.delete(listener);
  }

  public emit(event: V): void {
    const listeners = this.listeners.get(event.id as T);

    if (!listeners) return;
    for (const listener of listeners) {
      listener(event);
    }
  }
}

export { EventEmitter };
