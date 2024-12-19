import type { Client } from '../client';
import { ClientEvent } from '../types';

class ClientEventSignal {
  public static readonly id: ClientEvent;

  public static async tick?(_client: Client) {}
}

export { ClientEventSignal };
