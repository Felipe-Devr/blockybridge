import { Role } from 'structures/role';
import { Client } from '../client';
import { GuildMember } from '../structures';
import { RawRole, Routes } from '../types';

class RoleManager {
  private member: GuildMember;
  private client: Client;

  private roles: Map<string, Role> = new Map();

  constructor(client: Client, member: GuildMember, roles?: Array<string>) {
    this.member = member;
    this.client = client;
    this.roles = new Map(roles.map((role) => [role, undefined]));
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

  public async fetch(roleId: string): Promise<Role> {
    const cached = this.roles.get(roleId);

    if (cached) return cached;
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.member.guild.id}/roles/${roleId}`,
      'Get',
    );

    const rawRole = JSON.parse(response.body) as RawRole;
    const role = new Role(this.client, this.member.guild, rawRole);

    this.roles.set(roleId, role);
    return role;
  }
}

export { RoleManager };
