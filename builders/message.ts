import { EmbedBuilder } from './embed';
import { Routes } from 'djs/types/routes';
import Client from 'djs/client';
import { RawMessage } from 'djs/types';
import { MessageReference, MessageReferenceType } from 'djs/types/message';
import { Poll } from './poll';

class Message {
  private content: string;
  private channelId: string;
  public id: string;
  private embeds: Array<EmbedBuilder> = [];
  private poll?: Poll;
  private reference?: MessageReference;
  private client: Client;

  public constructor(client: Client, data?: RawMessage) {
    this.client = client;
    if (data) {
      this.deserialize(data);
    }
  }

  public setContent(content: string): this {
    this.content = content;
    return this;
  }

  public addEmbed(embed: EmbedBuilder): this {
    this.embeds.push(embed);
    return this;
  }

  public edit(content: string): this {
    this.content = content;
    this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.channelId}/messages/${this.id}`, 'Patch', this.serialize());

    return this;
  }

  public addPoll(poll: Poll): this {
    this.poll = poll;
    return this;
  }

  public getPoll(): Poll | undefined {
    return this.poll;
  }

  public async reply(message: Message | string): Promise<Message | undefined> {
    message = message instanceof Message ? message : new Message(this.client).setContent(message);
    message.setReference(MessageReferenceType.Default, this);

    const channel = await this.client.channels.resolve(this.channelId);

    if (!channel || !channel.isTextBased()) return;
    await channel.send(message);
    return message;
  }

  public setReference(type: MessageReferenceType, message: Message): this {
    this.reference = {
      messageId: message.id,
      channelId: message.channelId,
      type,
      failIfNotFound: true,
    };

    return this;
  }

  public delete(): this {
    this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.channelId}/messages/${this.id}`, 'DELETE');
    return this;
  }

  public serialize(): string {
    const serialized: Partial<RawMessage> = {
      content: this.content ?? '',
      embeds: this.embeds,
    };

    if (this.reference) {
      serialized.message_reference = {
        channel_id: this.reference.channelId,
        message_id: this.reference.messageId,
        fail_if_not_exists: this.reference.failIfNotFound,
        type: this.reference.type,
      };
    }

    if (this.poll) {
      serialized.poll = JSON.parse(this.poll.serialize());
    }
    return JSON.stringify(serialized);
  }

  // TODO
  private deserialize(data: RawMessage): void {
    const { id, channel_id, content } = data;

    this.id = id;
    this.channelId = channel_id;
    this.content = content;
    this.poll = data.poll ? new Poll(this.client, this.channelId, data) : undefined;
  }
}

export { Message };
