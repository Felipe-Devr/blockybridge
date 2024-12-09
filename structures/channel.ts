import Client from '../client';
import { Routes, ChannelType, Channels } from '../types';
import { TextChannel } from './text-channel';

class BaseChannel {
  protected client: Client;
  public id: string;

  // TODO
  public constructor(client: Client) {
    this.client = client;
  }

  public delete(): void {
    this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.id}`, 'DELETE');
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
}

export { BaseChannel };
