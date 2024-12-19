import { Guild, User } from '../structures';
import { ClientEventSignal } from '../structures/event';
import { ClientEvent } from '../types';
import { Client } from '../client';

class GuildBanAddEventSignal extends ClientEventSignal {
  public readonly id: ClientEvent;

  public readonly user: User;

  public readonly reason?: string;

  public constructor(user: User, reason?: string) {
    super();
    this.user = user;
    this.reason = reason;
  }

  public static async tick(client: Client, guilds: Array<Guild>) {
    for (const _guild of guilds) {
      // TODO: Fetch guild bans and compare them against the cached list
    }
  }
}

export { GuildBanAddEventSignal };
