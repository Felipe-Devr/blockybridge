import { ClientEvent } from 'djs/types';
import { ClientReadyEventSignal } from './ready';
import { MessageCreateEventSignal } from './message';
import { ClientDebugEventSignal } from './debug';

interface ClientEvents {
  [ClientEvent.Ready]: ClientReadyEventSignal;
  [ClientEvent.Message]: MessageCreateEventSignal;
  [ClientEvent.Debug]: ClientDebugEventSignal;
}

export { ClientEvents };
