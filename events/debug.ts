import { ClientEvent } from '../types';
import { ClientEventSignal } from '../structures/event';

class ClientDebugEventSignal extends ClientEventSignal {
  public static readonly id: ClientEvent = ClientEvent.Debug;

  public readonly message: string;

  public constructor(message: string) {
    super();
    this.message = `[BlockyBridge] [DEBUG] ${message}`;
  }
}

export { ClientDebugEventSignal };
