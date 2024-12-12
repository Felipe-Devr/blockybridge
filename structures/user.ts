import Client from 'djs/client';
import { RawUser, Routes, UrlImageOptions } from 'djs/types';
import { TextChannel } from './text-channel';
import { Message } from 'djs/builders';

class User {
  protected client: Client;

  // The DM text channel if the client has one with the user.
  public dmChannel?: TextChannel;

  // The user's ID.
  public readonly id: string;

  // The user's username.
  public readonly username: string;

  // The user's discriminator.
  public readonly discriminator: string;

  // Wether or not the user is a bot
  public readonly bot?: boolean;

  // The user's email if available.
  public readonly email?: string;

  // The user's banner color encoded as an integer representation of hexadecimal color code
  public readonly accentColor?: number;

  // The user's chosen language option
  public readonly locale?: string;

  //	The flags on a user's account
  public readonly flags?: number;

  // 	The public flags on a user's account
  public readonly publicFlags?: number;

  // Whether the email on this account has been verified
  public readonly verified?: boolean;

  // The user's avatar hash
  private readonly avatar?: string;

  // The user's banner hash
  private readonly banner?: string;

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
    channel.send(message);
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
    return `${Routes.Banner}/${this.id}/${this.banner}.${imageOptions.extension ?? 'png'}?size=${imageOptions.size ?? 512}`;
  }
}

export { User };
