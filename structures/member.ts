import Client from 'djs/client';
import { User } from './user';
import { BanOptions, RawMember, Routes } from 'djs/types';
import { Guild } from './guilds';
import { RoleManager } from 'djs/managers';

class GuildMember {
  // The internal user of the member
  public readonly user: User;

  // The guild the member is in
  public readonly guild: Guild;

  // The guild nick the member has
  public nick?: string;

  // The custom per guild avatar if available
  public avatar?: string;

  // The custom per guild banner if available
  public banner?: string;

  // Member Roles
  public roles: RoleManager;

  // Joined At Timestamp
  public joinedAt: Date;

  // Premium (Booster) since timestamp
  public premiumSince?: Date;

  // Wether or not the user is deafened in voice channels
  public deaf: boolean;

  // Wether or not the user is muted in voice channels
  public mute: boolean;

  // Guild Member flags, represented as a bit set
  public flags: number;

  // Whether the user has not yet passed the guild's Membership Screening requirements
  public pending?: boolean;

  // Total permissions of the member in the channel, including overwrites, returned when in the interaction object
  public permissions: string;

  private client: Client;

  public constructor(client: Client, guild: Guild, data: RawMember) {
    this.client = client;
    this.user = new User(client, data.user);
    this.guild = guild;

    const { nick, avatar, banner, roles, joinedAt, premiumSince, deaf, mute, flags, permissions, pending } = data;

    this.nick = nick;
    this.avatar = avatar;
    this.banner = banner;
    this.roles = new RoleManager(client, this, roles);
    this.joinedAt = new Date(joinedAt);
    this.premiumSince = premiumSince ? new Date(premiumSince) : undefined;
    this.deaf = deaf;
    this.mute = mute;
    this.flags = flags;
    this.pending = pending;
    this.permissions = permissions;
  }

  public async ban(options?: BanOptions): Promise<void> {
    await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.guild.id}/bans${this.user.id}/`,
      'Put',
      JSON.stringify({
        reason: options?.reason ?? '',
        delete_message_seconds: options?.deleteMessagesSeconds ?? 0,
      }),
    );
  }

  public async kick(): Promise<void> {
    await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${this.guild.id}/members/${this.user.id}`, 'DELETE');
  }
}

export { GuildMember };
