import { ClientEvent } from 'djs/types';
import { ClientReadyEventSignal } from './ready';

interface ClientEvents {
  [ClientEvent.Ready]: ClientReadyEventSignal;
}

export { ClientEvents };
