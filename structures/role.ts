import { Client } from 'client';
import { Guild } from './guilds';
import { PermissionBits, RawRole } from 'types';
import { Color } from './color';

class Role {
  private client: Client;

  private permissionsBits: bigint;
  public readonly guild: Guild;
  public readonly id: string;
  public readonly name: string;
  public readonly color: Color;
  public readonly mentionable: boolean;
  public readonly position: number;
  private icon: string;

  public constructor(client: Client, guild: Guild, data?: RawRole) {
    this.client = client;
    this.guild = guild;

    if (!data) return;
    const { id, name, color, mentionable, position, icon, permissions } = data;

    this.id = id;
    this.name = name;
    this.color = Color.fromInt(color);
    this.mentionable = mentionable;
    this.position = position;
    this.permissionsBits = BigInt(permissions);
    this.icon = icon;
  }

  /**
   * Checks if the role has the specified permissions
   * @param permissions The list of permissions, check PermissionBits
   * @returns Wether or not the role has the permissions
   */
  public hasPermission(...permissions: Array<bigint>): boolean {
    return PermissionBits.has(this.permissionsBits, ...permissions);
  }
}

export { Role };
