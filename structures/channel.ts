import { Message } from '../builders';
import { MessageCache } from '../caching';
import { Client } from '../client';
import { RawChannel, RawMessage, Routes } from '../types';

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

  public isTextBased(): this is BaseTextChannel {
    return this instanceof BaseTextChannel;
  }
}

class BaseTextChannel extends BaseChannel {
  protected messages: MessageCache;

  private _lastMessage: Message;

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

  /**
   * Sends a message to the text channel
   * @param message The message to send in the channel. For Polls use Poll.send
   * @returns
   */
  public async send(message: Message | string): Promise<Message> {
    if (typeof message === 'string') {
      message = new Message(this.client).setContent(message);
    }

    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.id}/messages`,
      'Post',
      message.toJSON(),
    );

    if (response.status != 200) throw new Error('Failed to send message');
    const newMessage = new Message(this.client, JSON.parse(response.body));

    message.channelId = newMessage.channelId;
    message.id = newMessage.id;

    this.messages.setMessage(newMessage.id, newMessage);

    return newMessage;
  }

  public async fetchLastMessage(save: boolean = true): Promise<Message> {
    const message = await this.messages.getLastMessage(true);

    if (save) this._lastMessage = message;
    return message;
  }

  public get lastMessage(): Message {
    return this._lastMessage;
  }

  public set lastMessage(message: Message) {
    this.messages.setMessage(message.id, message);
    this._lastMessage = message;
  }
}

export { BaseChannel, BaseTextChannel };
