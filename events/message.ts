import { Message } from 'djs/builders';
import { ClientEventSignal } from './event';
import { ClientEvent } from 'djs/types';
import { GuildMember } from 'djs/structures';

class MessageCreateEventSignal extends ClientEventSignal {
  public readonly id: ClientEvent = ClientEvent.Message;

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
}

export { MessageCreateEventSignal };
