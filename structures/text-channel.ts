import Client from 'djs/client';
import { BaseChannel } from './channel';
import { Message } from 'djs/builders';
import { MessageCache } from 'djs/caching';
import { system, TicksPerSecond } from '@minecraft/server';
import { AwaitMessageOptions, RawChannel, RawMessage, Routes } from 'djs/types';

class TextChannel extends BaseChannel {
  private messages: MessageCache;

  public constructor(client: Client, data?: RawChannel) {
    super(client);
    this.messages = new MessageCache(client, this);

    if (data) this.deserialize(data);
  }

  public async sendMessage(message: Message | string): Promise<void> {
    message = message instanceof Message ? message : new Message(this.client).setContent(message);

    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.id}/messages`,
      'Post',
      message.serialize(),
    );

    if (response.status != 200) throw new Error('Failed to send message');
    message = new Message(this.client, JSON.parse(response.body));
    this.messages.setMessage(message.id, message);
  }

  // TODO: Optimize this and fix it
  public awaitMessages(options: AwaitMessageOptions): Promise<Array<Message>> {
    return new Promise((resolve) => {
      let messages: Array<RawMessage> = [];

      const intervalId = system.runInterval(async () => {
        const lastMessage = await this.messages.getLastMessage();
        const response = await this.client.sendAuthenticatedRequest(
          `${Routes.Channels}/${this.id}/messages?after=${lastMessage.id}`,
          'Get',
        );
        messages = JSON.parse(response.body) as Array<RawMessage>;

        if (messages.length >= options.max) {
          system.clearRun(intervalId);
          return resolve(messages.map((raw) => new Message(this.client, raw)));
        }
      }, 20);

      system.runTimeout(() => {
        system.clearRun(intervalId);
        return resolve(messages.map((raw) => new Message(this.client, raw)));
      }, options.time * TicksPerSecond);
    });
  }

  private deserialize(data: RawChannel): void {
    const { id } = data;

    this.id = id;
  }
}

export { TextChannel };
