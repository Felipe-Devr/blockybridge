import { EmbedBuilder } from './embed';
import { Routes } from '../types/routes';
import { Client } from '../client';
import { RawMessage } from '../types';
import { MessageReference, MessageReferenceType } from '../types/message';
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
    if (!data) return;
    const { id, channel_id, content, message_reference } = data;

    // TODO: Add more raw fields
    this.id = id;
    this.channelId = channel_id;
    this.content = content;
    this.reference = message_reference
      ? {
          channelId: message_reference.channel_id,
          messageId: message_reference.message_id,
          type: message_reference.type,
          failIfNotFound: message_reference.fail_if_not_exists,
          guildId: message_reference.guild_id,
        }
      : undefined;
    this.poll = data.poll ? new Poll(this.client, this.channelId, data) : undefined;
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
    this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.channelId}/messages/${this.id}`, 'Patch', this.toJSON());

    return this;
  }

  public addPoll(poll: Poll): this {
    this.poll = poll;
    return this;
  }

  public getPoll(): Poll | undefined {
    return this.poll;
  }

  public isReply(): boolean {
    return !!this.reference;
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

  public toJSON(): string {
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
      serialized.poll = JSON.parse(this.poll.toJSON());
    }
    return JSON.stringify(serialized);
  }
}

export { Message };
