import { ClientEventSignal } from '../structures';
import { ClientEvent } from '../types';

console.log(typeof ClientEventSignal);
class ClientReadyEventSignal extends ClientEventSignal {
  public static readonly id: ClientEvent = ClientEvent.Ready;

  public readonly token: string;

  constructor(token: string) {
    super();
    this.token = token;
  }
}

export { ClientReadyEventSignal };
