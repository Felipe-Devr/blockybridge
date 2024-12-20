import { Client } from 'client';
import { ClientEventSignal } from '../structures';
import { ClientEvent } from '../types';

class ClientReadyEventSignal extends ClientEventSignal {
  public static readonly id: ClientEvent = ClientEvent.Ready;

  // ? The client instance
  public readonly client: Client;

  // ? The client token
  public readonly token: string;

  constructor(client: Client, token: string) {
    super();
    this.token = token;
    this.client = client;
  }
}

export { ClientReadyEventSignal };
