import { BaseChannel, Guild } from 'djs/structures';
import { ClientEventSignal } from './event';
import { ClientEvent } from 'djs/types';
import Client from 'djs/client';

class ChannelCreateEventSignal extends ClientEventSignal {
  public readonly id: ClientEvent = ClientEvent.ChannelCreate;

  // The channel that has been created
  public readonly channel: BaseChannel;

  public constructor(channel: BaseChannel) {
    super();
    this.channel = channel;
  }

  public static async tick(_client: Client, _guilds: Array<Guild>) {
    // TODO
  }
}

export { ChannelCreateEventSignal };
