import { ChannelCache, MembersCache } from '../caching';
import { Client } from '../client';
import {
  Channels,
  ChannelType,
  CreateChannelOptions,
  PartialGuild,
  RawChannel,
  RawGuild,
  Routes,
  UrlImageOptions,
} from '../types';
import { BaseChannel } from './channel';
import { BanManager } from '../managers';
import { ClientDebugEventSignal } from '../events';

class BaseGuild {
  protected client: Client;
  // The guild's ID
  public id: string;

  // The guild's name
  public name: string;

  // Icon image hash
  protected icon?: string;

  // Banner image hash
  protected banner?: string;

  public constructor(client: Client, data?: PartialGuild) {
    this.client = client;

    if (!data) return;
    const { id, banner, name, icon } = data;

    this.banner = banner;
    this.name = name;
    this.icon = icon;
    this.id = id;
  }

  public iconUrl(imageOptions: UrlImageOptions): string {
    if (!this.icon) return '';
    return `${Routes.Icon}/${this.id}/${this.icon}.${imageOptions.extension ?? 'png'}?size=${imageOptions.size ?? 512}`;
  }

  public bannerUrl(imageOptions: UrlImageOptions): string {
    if (!this.banner) return '';
    return `${Routes.Banner}/${this.id}/${this.banner}.${imageOptions.extension ?? 'png'}?size=${imageOptions.size ?? 512}`;
  }

  public fetch(): Promise<Guild> {
    return this.client.guilds.resolve(this.id, true);
  }
}

class Guild extends BaseGuild {
  // The guild's description
  public description?: string;

  // The guild's member cache
  public readonly members: MembersCache;

  // The guild's ban manager (used for managing bans)
  public readonly bans: BanManager;

  public constructor(client: Client, data?: RawGuild) {
    super(client, data);
    this.bans = new BanManager(client, this);
    this.members = new MembersCache(client, this);

    if (!data) return;
    const { description } = data;
    this.description = description;
  }

  public async fetch(): Promise<Guild> {
    return this;
  }

  public async fetchChannels(): Promise<void> {
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${this.id}/channels`, 'Get');

    if (response.status !== 200) throw new Error('Error fetching channels');
    const rawChannels = JSON.parse(response.body) as Array<RawChannel>;

    for (const rawChannel of rawChannels) {
      const channelConstructor = ChannelCache.getChannelByType(rawChannel.type as keyof Channels);

      if (!channelConstructor) {
        this.client.emit(new ClientDebugEventSignal(`Channel constructor not found for ${ChannelType[rawChannel.type]}`));
        continue;
      }
      const channel = new channelConstructor(this.client, rawChannel);

      this.client.channels.setChannel(channel.id, channel);
    }
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

    this.client.channels.setChannel(channel.id, channel);
    return channel;
  }
}

export { Guild, BaseGuild };
