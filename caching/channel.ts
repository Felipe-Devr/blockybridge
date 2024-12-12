import { BaseChannel, TextChannel } from 'djs/structures';
import { BaseCache } from './base';
import Client from 'djs/client';
import { RawChannel, Routes } from 'djs/types';
import { Channels, ChannelType } from 'djs/types/channel';

class ChannelCache extends BaseCache<string, BaseChannel> {
  constructor(client: Client) {
    super(client);
  }

  public async resolve(channelId: string): Promise<BaseChannel | undefined> {
    if (this.cache.has(channelId)) return this.cache.get(channelId);
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Channels}/${channelId}`, 'Get');

    if (response.status != 200) return undefined;
    const rawData = JSON.parse(response.body) as RawChannel;

    switch (rawData.type) {
      case ChannelType.GuildText: {
        const channel = new TextChannel(this.client, rawData);
        this.cache.set(channelId, channel);
        return channel;
      }
    }
  }

  public static getChannelByType<T extends keyof Channels>(type: T): Channels[T] | undefined {
    switch (type) {
      case ChannelType.Dm:
      case ChannelType.GuildText:
        return TextChannel;
      default:
        return;
    }
  }

  public setChannel(channelId: string, channel: BaseChannel) {
    this.cache.set(channelId, channel);
  }

  public getChannels(): Array<BaseChannel> {
    return Array.from(this.cache.values());
  }

  *[Symbol.iterator](): IterableIterator<BaseChannel> {
    return this.cache.values();
  }
}

export { ChannelCache };
