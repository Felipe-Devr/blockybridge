import { ChannelCache, MembersCache } from 'djs/caching';
import Client from 'djs/client';
import { Channels, CreateChannelOptions, RawChannel, RawGuild, Routes } from 'djs/types';
import { BaseChannel } from './channel';
import { BanManager } from 'djs/managers';

class Guild {
  private client: Client;

  // The guild's channel cache
  public readonly channels: ChannelCache;

  // The guild's member cache
  public readonly members: MembersCache;

  // The guild's ban manager (used for managing bans)
  public readonly bans: BanManager;

  // The guild's ID
  public id: string;

  public constructor(client: Client, data?: RawGuild) {
    this.client = client;
    this.channels = new ChannelCache(client);
    this.bans = new BanManager(client, this);
    this.members = new MembersCache(client, this);

    if (!data) return;
    // TODO: Add more fields
    const { id } = data;

    this.id = id;
  }

  public async fetchChannels(): Promise<void> {
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${this.id}/channels`, 'Get');

    if (response.status !== 200) throw new Error('Error fetching channels');
    const rawChannels = JSON.parse(response.body) as Array<RawChannel>;

    rawChannels.forEach((raw) => {
      const channelConstructor = ChannelCache.getChannelByType(raw.type as keyof Channels);

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
    const channelConstructor = ChannelCache.getChannelByType(rawChannel.type as keyof Channels);

    if (!channelConstructor) return;
    const channel = new channelConstructor(this.client, rawChannel);
    this.channels.setChannel(channel.id, channel);

    return channel;
  }
}

export { Guild };
