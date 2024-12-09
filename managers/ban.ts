import Client from 'djs/client';
import { Guild } from 'djs/structures';
import { BanOptions, Routes } from 'djs/types';

class BanManager {
  private guild: Guild;
  private client: Client;

  // TODO: Map<string, Ban>
  private bans: Set<string> = new Set();

  public constructor(client: Client, guild: Guild) {
    this.client = client;
    this.guild = guild;
  }

  public async ban(userId: string, options: BanOptions): Promise<boolean> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.guild.id}/bans/${userId}/`,
      'Put',
      JSON.stringify({
        reason: options?.reason ?? '',
        delete_message_seconds: options?.deleteMessagesSeconds ?? 0,
      }),
    );

    if (response.status === 204) {
      this.bans.add(userId);
      return true;
    }
    return false;
  }

  public async bulkBan(userIds: Array<string>, options: BanOptions): Promise<boolean> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Guilds}/${this.guild.id}/bulk-ban/`,
      'Post',
      JSON.stringify({
        userIds,
        reason: options?.reason ?? '',
        delete_message_seconds: options?.deleteMessagesSeconds ?? 0,
      }),
    );

    if (response.status === 200) {
      userIds.forEach((userId) => this.bans.add(userId));
      return true;
    }
    return false;
  }

  public async unban(userId: string): Promise<boolean> {
    const response = await this.client.sendAuthenticatedRequest(`${Routes.Guilds}/${this.guild.id}/bans/${userId}`, 'DELETE');

    if (response.status === 204) {
      this.bans.delete(userId);
      return true;
    }
    return false;
  }
}

export { BanManager };
