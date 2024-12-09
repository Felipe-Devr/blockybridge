import { Message, Poll } from 'djs/builders';
import { MessageCache } from 'djs/caching';
import Client from '../client';
import { RawChannel, Routes } from '../types';
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

    if (data) this.deserialize(data);
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
      message.serialize(),
    );

    if (response.status != 200) throw new Error('Failed to send message');
    message = new Message(this.client, JSON.parse(response.body));
    this.messages.setMessage(message.id, message);

    return message;
  }

  private deserialize(data: RawChannel): void {
    const { id } = data;

    this.id = id;
  }
}

export { BaseChannel, BaseTextChannel };
