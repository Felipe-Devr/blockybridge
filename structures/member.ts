import Client from 'djs/client';
import { User } from './user';
import { RawMember } from 'djs/types';

class GuildMember {
  public readonly user: User;
  public nick?: string;
  public avatar?: string;
  public banner?: string;
  public roles: Array<string> = [];
  public joinedAt: Date;
  public premiumSince?: Date;
  public deaf: boolean;
  public mute: boolean;
  public flags: number;
  public pending?: boolean;
  public permissions: string;
  private client: Client;

  public constructor(client: Client, data: RawMember) {
    this.client = client;
    this.user = new User(client, data.user);

    const { nick, avatar, banner, roles, joinedAt, premiumSince, deaf, mute, flags, permissions, pending } = data;

    this.nick = nick;
    this.avatar = avatar;
    this.banner = banner;
    this.roles = roles;
    this.joinedAt = new Date(joinedAt);
    this.premiumSince = premiumSince ? new Date(premiumSince) : undefined;
    this.deaf = deaf;
    this.mute = mute;
    this.flags = flags;
    this.pending = pending;
    this.permissions = permissions;
  }
}

export { GuildMember };
