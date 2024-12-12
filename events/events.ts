import { ClientEvent } from 'djs/types';
import { ClientReadyEventSignal } from './ready';
import { MessageCreateEventSignal } from './message-create';
import { ClientDebugEventSignal } from './debug';
import { ChannelCreateEventSignal } from './channel-create';
import { GuildBanAddEventSignal } from './member-ban';

interface ClientEvents {
  [ClientEvent.Ready]: ClientReadyEventSignal;
  [ClientEvent.MessageCreate]: MessageCreateEventSignal;
  [ClientEvent.ChannelCreate]: ChannelCreateEventSignal;
  [ClientEvent.Debug]: ClientDebugEventSignal;
  [ClientEvent.GuildBanAdd]: GuildBanAddEventSignal;
}

export { ClientEvents };
