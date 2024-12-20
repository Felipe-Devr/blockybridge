import { BaseChannel, TextChannel } from '../structures';
import { BaseCache } from './base';
import { Client } from '../client';
import { RawChannel, Routes } from '../types';
import { Channels, ChannelType } from '../types/channel';
import { ClientDebugEventSignal } from '../events';

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
    this.client.emit(new ClientDebugEventSignal('Caching channeld with id' + channelId));
    this.cache.set(channelId, channel);
  }

  public getChannels(): Array<BaseChannel> {
    return Array.from(this.cache.values());
  }

  *[Symbol.iterator](): IterableIterator<BaseChannel> {
    for (const channel of this.cache.values()) {
      yield channel;
    }
  }

  public get size(): number {
    return this.cache.size;
  }
}

export { ChannelCache };
