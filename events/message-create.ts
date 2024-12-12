import { Message } from 'djs/builders';
import { ClientEventSignal } from './event';
import { ClientEvent } from 'djs/types';
import { BaseChannel, GuildMember } from 'djs/structures';
import Client from 'djs/client';

class MessageCreateEventSignal extends ClientEventSignal {
  public readonly id: ClientEvent = ClientEvent.MessageCreate;

  public readonly guildId?: string;

  public readonly member?: GuildMember;

  // TODO: mentions

  public readonly message: Message;

  public constructor(message: Message, guildId?: string, guildMember?: GuildMember) {
    super();
    this.message = message;
    this.guildId = guildId;
    this.member = guildMember;
  }

  public static async tick(client: Client, channels: Array<BaseChannel>) {
    for (const channel of channels) {
      // If the channel is not text based, skip the channel
      if (!channel.isTextBased()) continue;
      // If the channel does not have a cached last message, then fetch the last message
      if (!channel.lastMessage) {
        await channel.fetchLastMessage();
        continue;
      }
      // Fetch the last message without caching it
      const lastMessage = await channel.fetchLastMessage(false);

      // If the fetched message is the same as the cached last message or the last message is a reply, skip it.
      if (lastMessage.id == channel.lastMessage.id || lastMessage.isReply()) continue;
      // Cache the new last message
      channel.lastMessage = lastMessage;

      // Create the signal and emit it.
      const signal = new MessageCreateEventSignal(lastMessage);
      client.emit(signal);
    }
  }
}

export { MessageCreateEventSignal };