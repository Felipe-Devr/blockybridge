import { Client } from '../client';
import { ClientEventSignal } from '../structures';
import { ClientEvent } from '../types';

class ClientReadyEventSignal extends ClientEventSignal {
  public readonly id = ClientEvent.Ready;

  /**
   * The client token
   */
  public readonly token: string;

  /**
   * The client that has been initializeds
   */
  public readonly client: Client;

  public constructor(client: Client, token: string) {
    super();
    this.client = client;
    this.token = token;
  }
}

export { ClientReadyEventSignal };
