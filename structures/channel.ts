import { Message, Poll } from 'djs/builders';
import { MessageCache } from 'djs/caching';
import Client from '../client';
import { RawChannel, RawMessage, Routes } from '../types';
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

  public isTextBased(): this is TextChannel {
    return this instanceof BaseTextChannel;
  }
}

class BaseTextChannel extends BaseChannel {
  protected messages: MessageCache;

  public constructor(client: Client, data?: RawChannel) {
    super(client);
    this.messages = new MessageCache(client, this);

    if (!data) return;
    // TODO: Add more fields
    const { id } = data;

    this.id = id;
  }

  public async fetchMessages(): Promise<void> {
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.id}/messages`, 'Get');

    if (response.status != 200) return;
    const messages = JSON.parse(response.body) as Array<RawMessage>;

    for (const rawMessage of messages) {
      const message = new Message(this.client, rawMessage);
      this.messages.setMessage(message.id, message);
    }
  }

  public async send(message: Message | string | Poll): Promise<Message> {
    if (typeof message === 'string') {
      message = new Message(this.client).setContent(message);
    } else if (message instanceof Poll) {
      message = new Message(this.client).addPoll(message);
    }

    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.id}/messages`,
      'Post',
      message.toJSON(),
    );

    if (response.status != 200) throw new Error('Failed to send message');
    message = new Message(this.client, JSON.parse(response.body));
    this.messages.setMessage(message.id, message);

    return message;
  }
}

export { BaseChannel, BaseTextChannel };
