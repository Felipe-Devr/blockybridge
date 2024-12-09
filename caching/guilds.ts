import { Guild } from 'djs/structures';
import { BaseCache } from './base';
import Client from 'djs/client';
import { RawGuild, Routes } from 'djs/types';

class GuildCache extends BaseCache<string, Guild> {
  constructor(client: Client) {
    super(client);
  }

  public async resolve(guildId: string): Promise<Guild | undefined> {
    if (this.cache.has(guildId)) return this.cache.get(guildId);
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${guildId}`, 'Get');

    if (response.status !== 200) return;
    const guild = new Guild(this.client, JSON.parse(response.body) as RawGuild);

    this.cache.set(guildId, guild);
    return guild;
  }

  public setGuild(guildId: string, guild: Guild): void {
    this.cache.set(guildId, guild);
  }
}

export { GuildCache };
