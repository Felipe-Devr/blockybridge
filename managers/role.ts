import { Client } from '../client';
import { GuildMember } from '../structures';
import { Routes } from '../types';

class RoleManager {
  private member: GuildMember;
  private client: Client;

  // TODO: Map<string, GuildRole>
  private roles: Set<string> = new Set();

  constructor(client: Client, member: GuildMember, roles?: Array<string>) {
    this.member = member;
    this.client = client;
    this.roles = new Set(roles);
  }

  public async addRole(roleId: string): Promise<boolean> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.member.guild.id}/members/${this.member.user.id}/roles/${roleId}`,
      'PUT',
    );

    return response.status === 204;
  }

  public async removeRole(roleId: string): Promise<boolean> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.member.guild.id}/members/${this.member.user.id}/roles/${roleId}`,
      'DELETE',
    );

    return response.status === 204;
  }

  public getRoles(): Array<string> {
    return Array.from(this.roles);
  }
}

export { RoleManager };
