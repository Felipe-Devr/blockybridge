import { BaseChannel, Guild } from '../structures';
import { ClientEventSignal } from '../structures/event';
import { ClientEvent } from '../types';
import { Client } from '../client';

class ChannelCreateEventSignal extends ClientEventSignal {
  public readonly id: ClientEvent = ClientEvent.ChannelCreate;

  // The channel that has been created
  public readonly channel: BaseChannel;

  public constructor(channel: BaseChannel) {
    super();
    this.channel = channel;
  }

  public static async tick(client: Client, guilds: Array<Guild>) {
    // ? Save the last channel size
    const channelCount = client.channels.size;

    for (const guild of guilds) {
      // ? Fetch every guild's channels
      await guild.fetchChannels();
    }
    // ? Compare the size
    if (channelCount == client.channels.size) return;

    // ? If the size changed, then get the new channel
    const newChannel = client.channels.getChannels()[channelCount];

    // ? Emit the channel creation event
    client.emit(new this(newChannel));
  }
}

export { ChannelCreateEventSignal };
