import { TextChannel } from '../structures';

enum ChannelType {
  GuildText,
  Dm,
  GuildVoice,
  GroupDm,
  GuildCategory,
  GuildAnnouncement,
  AnnouncementThread,
  PublicThread,
  PrivateThread,
  GuildStageVoice,
  GuildDirectory,
  GuildForum,
  GuildMedia,
}

// TODO: Add the other
interface Channels {
  [ChannelType.GuildText]: typeof TextChannel;
  [ChannelType.Dm]: typeof TextChannel;
}

export { ChannelType, Channels };
