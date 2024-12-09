import { ChannelType } from './channel';

interface RawMessage {
  id: string;
  content: string;
  channel_id: string;
}

interface RawChannel {
  id: string;
  type: ChannelType;
}

interface RawGuild {
  id: string;
}

interface RawUser {
  id: string;
  username: string;
  discriminator: string;
  bot?: boolean;
  email?: string;
  accent_color?: number;
  locale?: string;
  flags?: number;
  public_flags?: number;
  verified?: boolean;
  avatar?: string;
  banner?: string;
}

interface RawMember {
  readonly user: RawUser;
  nick?: string;
  avatar?: string;
  banner?: string;
  roles: Array<string>;
  joinedAt: Date;
  premiumSince?: Date;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending?: boolean;
  permissions: string;
}

export { RawMessage, RawChannel, RawGuild, RawUser, RawMember };
