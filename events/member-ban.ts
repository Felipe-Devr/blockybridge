import { User } from '../structures';
import { ClientEventSignal } from '../structures/event';
import { ClientEvent } from '../types';
import type { Client } from '../client';

class GuildBanAddEventSignal extends ClientEventSignal {
  public static readonly id: ClientEvent;

  public readonly user: User;

  public readonly reason?: string;

  public constructor(user: User, reason?: string) {
    super();
    this.user = user;
    this.reason = reason;
  }

  public static async tick(client: Client) {
    for (const _guild of []) {
      // TODO: Fetch guild bans and compare them against the cached list
    }
  }
}

export { GuildBanAddEventSignal };
