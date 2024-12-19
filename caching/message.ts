import { Message } from '../builders';
import { Client } from '../client';
import { BaseCache } from './base';
import { BaseTextChannel } from '../structures';
import { Routes } from '../types';

class MessageCache extends BaseCache<string, Message> {
  private channel: BaseTextChannel;

  public constructor(client: Client, channel: BaseTextChannel) {
    super(client);
    this.channel = channel;
  }

  public getMessages(): Array<Message> {
    return Array.from(this.cache.values());
  }

  public setMessage(messageId: string, message: Message): void {
    this.cache.set(messageId, message);
  }

  public async resolve(messageId: string): Promise<Message | undefined> {
    if (this.cache.has(messageId)) return this.cache.get(messageId);
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.channel.id}/messages/${messageId}`,
      'Get',
    );

    if (response.status != 200) return;
    const message = new Message(this.client, JSON.parse(response.body));
    this.setMessage(messageId, message);
    return message;
  }

  public async getLastMessage(force: boolean = false): Promise<Message | undefined> {
    if (this.cache.size > 0 && !force) {
      return this.getMessages().slice(-1)[0];
    }
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.channel.id}/messages?limit=1`, 'Get');

    if (response.status != 200) return;
    const message = new Message(this.client, JSON.parse(response.body)[0]);
    this.setMessage(message.id, message);
    return message;
  }
}

export { MessageCache };
