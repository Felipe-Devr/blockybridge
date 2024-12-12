import { Guild, User } from 'djs/structures';
import { ClientEventSignal } from './event';
import { ClientEvent } from 'djs/types';
import Client from 'djs/client';

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
