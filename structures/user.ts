import Client from 'djs/client';
import { RawUser, Routes, UrlImageOptions } from 'djs/types';
import { TextChannel } from './text-channel';
import { Message } from 'djs/builders';

class User {
  protected client: Client;
  public dmChannel?: TextChannel;
  public readonly id: string;
  public readonly username: string;
  public readonly discriminator: string;
  public readonly bot?: boolean;
  public readonly email?: string;
  public readonly accentColor?: number;
  public readonly locale?: string;
  public readonly flags?: number;
  public readonly publicFlags?: number;
  public readonly verified?: boolean;
  public readonly avatar?: string;
  public readonly banner?: string;

  public constructor(client: Client, data: RawUser) {
    this.client = client;

    const { id, username, discriminator, bot, email, accent_color, locale, flags, verified, avatar, banner, public_flags } = data;

    this.id = id;
    this.username = username;
    this.discriminator = discriminator;
    this.bot = bot;
    this.email = email;
    this.accentColor = accent_color;
    this.locale = locale;
    this.flags = flags;
    this.verified = verified;
    this.avatar = avatar;
    this.banner = banner;
    this.publicFlags = public_flags;
  }

  public async send(message: Message | string): Promise<Message> {
    const channel = await this.createDm();

    if (!channel) return;
    channel.sendMessage(message);
  }

  public async deleteDm(): Promise<void> {
    if (!this.dmChannel) return;
    this.dmChannel.delete();
  }

  public async createDm(): Promise<TextChannel> {
    const channel = await this.client.sendAuthenticatedRequest(
      `${Routes.Users}/@me/channels`,
      'Post',
      JSON.stringify({
        recipient_id: this.id,
      }),
    );

    if (channel.status != 200) return;
    const textChannel = new TextChannel(this.client, JSON.parse(channel.body)); // TODO: Implement DMChannel structure

    this.dmChannel = textChannel; // Store the created DM channel in the User instance
    return textChannel;
  }

  public avatarUrl(imageOptions: UrlImageOptions): string {
    if (!this.avatar) return '';
    return `${Routes.Avatar}/${this.id}/${this.avatar}.${imageOptions.extension ?? 'png'}?size=${imageOptions.size ?? 512}`;
  }

  public bannerUrl(imageOptions: UrlImageOptions): string {
    if (!this.banner) return '';
    return `${Routes.Banner}/${this.id}/${this.avatar}.${imageOptions.extension ?? 'png'}?size=${imageOptions.size ?? 512}`;
  }
}

export { User };
