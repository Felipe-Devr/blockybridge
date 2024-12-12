import { ClientEvent } from 'djs/types';
import { ClientEventSignal } from './event';

class ClientDebugEventSignal extends ClientEventSignal {
  public readonly id: ClientEvent = ClientEvent.Debug;

  public readonly message: string;

  public constructor(message: string) {
    super();
    this.message = `[BlockyBridge] [DEBUG] ${message}`;
  }
}

export { ClientDebugEventSignal };
