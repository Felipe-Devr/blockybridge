import { ChannelType } from './channel';
import { MessageReferenceType } from './message';
import { PollMedia } from './poll';

interface RawMessage {
  id: string;
  content: string;
  channel_id: string;
  embeds?: Array<object>;
  message_reference?: RawMessageReference;
  poll?: RawPoll;
}

interface RawMessageReference {
  type?: MessageReferenceType;
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
  fail_if_not_exists?: boolean;
}

interface PollAnswerCount {
  id: number;
  count: number;
  me_voted: boolean;
}

interface RawPoll {
  question: PollMedia;
  answers: Array<{
    answer_id: number;
    poll_media: PollMedia;
  }>;
  results?: PollResult;
  expiry?: string;
  duration: number;
  allow_multiselect: boolean;
  layout_type: 1;
}

interface PollResult {
  is_finalized: boolean;
  answer_counts: Array<PollAnswerCount>;
}

interface PollAnswerCount {
  id: number;
  count: number;
  me_voted: boolean;
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
  joinedAt: string;
  premiumSince?: string;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending?: boolean;
  permissions: string;
}

export { RawMessage, RawChannel, RawGuild, RawUser, RawMember, RawMessageReference, RawPoll, PollResult, PollAnswerCount };
