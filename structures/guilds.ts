import { ChannelCache, MembersCache } from 'djs/caching';
import Client from 'djs/client';
import { Channels, CreateChannelOptions, RawChannel, RawGuild, Routes } from 'djs/types';
import { BaseChannel } from './channel';

class Guild {
  private client: Client;
  public readonly channels: ChannelCache;
  public readonly members: MembersCache;
  public id: string;

  public constructor(client: Client, data?: RawGuild) {
    this.client = client;
    this.channels = new ChannelCache(client);

    if (data) this.deserialize(data);
  }

  public async fetchChannels(): Promise<void> {
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${this.id}/channels`, 'Get');

    if (response.status !== 200) throw new Error('Error fetching channels');
    const rawChannels = JSON.parse(response.body) as Array<RawChannel>;

    rawChannels.forEach((raw) => {
      const channelConstructor = BaseChannel.getChannelByType(raw.type as keyof Channels);

      if (!channelConstructor) return null;
      const channel = new channelConstructor(this.client, raw);

      this.channels.setChannel(channel.id, channel);
    });
  }

  public async createChannel<V extends keyof CreateChannelOptions>(
    type: V,
    options: CreateChannelOptions[V],
  ): Promise<BaseChannel | undefined> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.id}/channels`,
      'Post',
      JSON.stringify(options),
    );

    if (response.status != 200) return;
    const rawChannel = JSON.parse(response.body) as RawChannel;
    const channelConstructor = BaseChannel.getChannelByType(rawChannel.type as keyof Channels);

    if (!channelConstructor) return;
    const channel = new channelConstructor(this.client, rawChannel);
    this.channels.setChannel(channel.id, channel);

    return channel;
  }

  private deserialize(data: RawGuild) {
    const { id } = data;

    this.id = id;
  }
}

export { Guild };
