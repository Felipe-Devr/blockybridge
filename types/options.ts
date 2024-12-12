import { Message } from 'djs/builders';
import { ChannelType } from './channel';

interface AwaitMessageOptions {
  filter?: (message: Message) => boolean;
  max: number;
  time: number;
}

interface UrlImageOptions {
  extension?: string;
  size?: ImageSize;
  forceStatic?: boolean;
}

interface CreateTextChannelOptions {
  name: string;
  type: ChannelType;
  position: number;
  parent_id: string;
  nsfw: boolean;
}

interface CreateVoiceChannelOptions {
  name: string;
  type: ChannelType;
  position: number;
  parent_id: string;
  nsfw: boolean;
  bitrate: number;
  user_limit: number;
}

interface BanOptions {
  reason?: string;
  deleteMessagesSeconds?: number;
}

interface CreateChannelOptions {
  [ChannelType.GuildText]: CreateTextChannelOptions;
  [ChannelType.GuildVoice]: CreateVoiceChannelOptions;
  [ChannelType.GuildStageVoice]: CreateVoiceChannelOptions;
  [ChannelType.GuildMedia]: CreateTextChannelOptions;
}

interface MemberFetchOptions {
  limit?: number;
  after?: string;
}

interface GuildFetchOptions {
  before?: string;
  limit?: number;
  after?: string;
  withCounts?: boolean;
}

interface PollFetchOptions {
  limit?: number;
  after?: string;
}

interface GuildMemberEditOptions {
  nick?: string;
  reason?: string;
  communicationDisabledUntil?: Date | number;
  deaf?: boolean;
  flags?: number;
  mute?: boolean;
  roles?: Array<string>;
  channel?: string;
}

const VALID_SIZE = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

type ImageSize = (typeof VALID_SIZE)[number];

export {
  AwaitMessageOptions,
  UrlImageOptions,
  CreateChannelOptions,
  BanOptions,
  MemberFetchOptions,
  GuildFetchOptions,
  PollFetchOptions,
  GuildMemberEditOptions,
};
