import { Guild } from 'djs/structures';
import { BaseCache } from './base';
import Client from 'djs/client';
import { GuildFetchOptions, RawGuild, Routes } from 'djs/types';

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

  public async fetch(options?: GuildFetchOptions): Promise<Array<Guild>> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Users}/@me/guilds`,
      'Get',
      JSON.stringify(
        options
          ? {
              ...options,
              with_counts: options.withCounts,
            }
          : undefined,
      ),
    );

    const rawGuilds = JSON.parse(response.body) as Array<RawGuild>;
    const guilds = rawGuilds.map((raw) => new Guild(this.client, raw));

    for (const guild of guilds) {
      this.cache.set(guild.id, guild);
    }
    return guilds;
  }

  public setGuild(guildId: string, guild: Guild): void {
    this.cache.set(guildId, guild);
  }
}

export { GuildCache };
