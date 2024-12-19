import type { ClientReadyEventSignal } from '../events/ready';
import type { MessageCreateEventSignal } from '../events/message-create';
import type { ClientDebugEventSignal } from '../events/debug';
import type { GuildBanAddEventSignal } from '../events/member-ban';

enum ClientEvent {
  Ready,
  MessageCreate,
  Debug,
  GuildBanAdd,
}

interface ClientEvents {
  [ClientEvent.Ready]: ClientReadyEventSignal;
  [ClientEvent.MessageCreate]: MessageCreateEventSignal;
  [ClientEvent.Debug]: ClientDebugEventSignal;
  [ClientEvent.GuildBanAdd]: GuildBanAddEventSignal;
}

export { ClientEvent, ClientEvents };
