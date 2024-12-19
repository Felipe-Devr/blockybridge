import { ClientReadyEventSignal } from '../events/ready';
import { MessageCreateEventSignal } from '../events/message-create';
import { ClientDebugEventSignal } from '../events/debug';
import { ChannelCreateEventSignal } from '../events/channel-create';
import { GuildBanAddEventSignal } from '../events/member-ban';

enum ClientEvent {
  Ready,
  MessageCreate,
  ChannelCreate,
  Debug,
  GuildBanAdd,
}

interface ClientEvents {
  [ClientEvent.Ready]: ClientReadyEventSignal;
  [ClientEvent.MessageCreate]: MessageCreateEventSignal;
  [ClientEvent.ChannelCreate]: ChannelCreateEventSignal;
  [ClientEvent.Debug]: ClientDebugEventSignal;
  [ClientEvent.GuildBanAdd]: GuildBanAddEventSignal;
}

export { ClientEvent, ClientEvents };
