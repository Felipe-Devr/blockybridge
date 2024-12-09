import { Guild, GuildMember } from 'djs/structures';
import { BaseCache } from './base';
import Client from 'djs/client';
import { MemberFetchOptions, RawMember, Routes } from 'djs/types';

class MembersCache extends BaseCache<string, GuildMember> {
  private guild: Guild;

  public constructor(client: Client, guild: Guild) {
    super(client);
    this.guild = guild;
  }

  /**
   * Get the cached members of the guild
   */
  public getMembers(): Array<GuildMember> {
    return Array.from(this.cache.values());
  }

  /**
   * Fetches the members of the guild and adds them to the cache.
   * ! Your application need the guild members priviliged intent
   * ! in order to access the members.
   */
  public async fetch(options?: MemberFetchOptions): Promise<Array<GuildMember>> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.guild.id}/members`,
      'Get',
      options ? JSON.stringify(options) : undefined,
    );

    if (response.status !== 200) return [];
    const rawMembers = JSON.parse(response.body) as Array<RawMember>;
    const members = rawMembers.map((raw) => new GuildMember(this.client, this.guild, raw));

    for (const member of members) {
      this.cache.set(member.user.id, member);
    }
    return members;
  }

  /**
   * Resolves the guild member based on the member id.
   * @param memberId The id of the member to retrieve
   * @returns The member if existi, otherwise undefined
   */
  public async resolve(memberId: string): Promise<GuildMember | undefined> {
    if (this.cache.has(memberId)) return this.cache.get(memberId);
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${this.guild.id}/members/${memberId}`, 'Get');

    if (response.status !== 200) return;
    const member = new GuildMember(this.client, this.guild, JSON.parse(response.body));

    this.cache.set(memberId, member);
    return member;
  }
}

export { MembersCache };
