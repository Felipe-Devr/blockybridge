import { BaseGuild, Guild } from 'djs/structures';
import { BaseCache } from './base';
import Client from 'djs/client';
import { GuildFetchOptions, PartialGuild, RawGuild, Routes } from 'djs/types';

class GuildCache extends BaseCache<string, Guild | BaseGuild> {
  constructor(client: Client) {
    super(client);
  }

  public async resolve(guildId: string, full?: true): Promise<Guild>;
  public async resolve(guildId: string, full?: false): Promise<BaseGuild>;
  public async resolve(guildId: string, full: boolean = true): Promise<Guild | BaseGuild | undefined> {
    // If the full guild was not requested, then we will search it in the cache, if there's nothing in cache
    // Then we will fetch the guilds
    const cachedGuild = this.cache.get(guildId);
    if (cachedGuild && full && cachedGuild instanceof Guild) return this.cache.get(guildId);
    if (!full) return (await this.fetch()).find((guild) => guild.id === guildId);
    // Fetch the full data of the guild using his id
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${guildId}`, 'Get');

    // If the response is other than 200, this means that we cant access to that server info
    if (response.status !== 200) return;

    // Parse the body response and provide it to the Guild constructor to construct the guild.
    const guild = new Guild(this.client, JSON.parse(response.body) as RawGuild);

    // Add the guild to the guilds cache
    this.cache.set(guildId, guild);
    return guild;
  }

  public async fetch(options?: GuildFetchOptions): Promise<Array<BaseGuild>> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Users}/@me/guilds`,
      'Get',
      options
        ? JSON.stringify({
            ...options,
            with_counts: options.withCounts,
          })
        : undefined,
    );

    const rawGuilds = JSON.parse(response.body) as Array<PartialGuild>;
    for (const guild of rawGuilds) {
      const cachedGuild = this.cache.get(guild.id);

      if (cachedGuild instanceof Guild) continue;
      this.cache.set(guild.id, new BaseGuild(this.client, guild));
    }
    return rawGuilds.map((raw) => new BaseGuild(this.client, raw));
  }

  public setGuild(guildId: string, guild: Guild): void {
    this.cache.set(guildId, guild);
  }

  *[Symbol.iterator]() {
    for (const guild of this.cache.values()) {
      yield guild;
    }
  }
}

export { GuildCache };
