import { EmbedBuilder } from './embed';
import { Routes } from 'djs/types/routes';
import Client from 'djs/client';
import { RawMessage } from 'djs/types';

class Message {
  public content: string;
  public id: string;
  public channelId: string;
  public embeds: Array<EmbedBuilder> = [];
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

  //TODO
  public reply(_message: Message): this {
    return this;
  }

  public delete(): this {
    this.client.sendAuthenticatedRequest(`${Routes.Channels}/${this.channelId}/messages/${this.id}`, 'DELETE');
    return this;
  }

  public serialize(): string {
    return JSON.stringify({
      content: this.content ?? '',
      embeds: this.embeds,
    });
  }

  // TODO
  private deserialize(data: RawMessage): void {
    const { id, channel_id, content } = data;

    this.id = id;
    this.channelId = channel_id;
    this.content = content;
  }
}

export { Message };
