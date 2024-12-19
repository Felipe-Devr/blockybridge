class PermissionBits {
  public static CreateInstantInvite = 1n;
  public static KickMembers = 2n;
  public static BanMembers = 4n;
  public static Administrator = 8n;
  public static ManageChannels = 16n;
  public static ManageGuild = 32n;
  public static AddReactions = 64n;
  public static ViewAuditLog = 128n;
  public static PrioritySpeaker = 256n;
  public static Stream = 512n;
  public static ViewChannel = 1024n;
  public static SendMessages = 2048n;
  public static SendTTSMessages = 4096n;
  public static ManageMessages = 8192n;
  public static EmbedLinks = 16384n;
  public static AttachFiles = 32768n;
  public static ReadMessageHistory = 65536n;
  public static MentionEveryone = 131072n;
  public static UseExternalEmojis = 262144n;
  public static ViewGuildInsights = 524288n;
  public static Connect = 1048576n;
  public static Speak = 2097152n;
  public static MuteMembers = 4194304n;
  public static DeafenMembers = 8388608n;
  public static MoveMembers = 16777216n;
  public static UseVoiceActivityDetection = 33554432n;
  public static ChangeNickname = 67108864n;
  public static ManageNicknames = 134217728n;
  public static ManageRoles = 268435456n;
  public static ManageWebhooks = 536870912n;
  public static ManageGuildExpressions = 1073741824n;
  public static UseAppCommands = 2147483648n;
  public static RequestToSpeak = 4294967296n;
  public static ManageEvents = 8589934592n;
  public static ManageThreads = 17179869184n;
  public static CreatePublicThreads = 34359738368n;
  public static CreatePrivateThreads = 68719476736n;
  public static UseExternalStickers = 137438953472n;
  public static SendThreadMessages = 274877906944n;
  public static UseEmbeddedActivites = 549755813888n;
  public static ModerateMembers = 1099511627776n;
  public static ViewMonetizationAnalitics = 2199023255552n;
  public static UseSoundBoard = 4398046511104n;
  public static CreateGuildExpressions = 8796093022208n;
  public static CreateEvents = 17592186044416n;
  public static UseExternalSounds = 35184372088832n;
  public static SendVoiceMessages = 70368744177664n;
  public static SendPolls = 562949953421312n;
  public static UseExternalApps = 1125899906842624n;

  public static has(bits: bigint, ...permissions: Array<bigint>) {
    for (const bit of permissions) {
      if ((bits & bit) !== bit) return false;
    }
    return true;
  }

  public static get All(): bigint {
    let permissions = 0n;

    for (const key of Object.keys(this)) {
      const value = this[key];

      if (typeof value == 'bigint') return;
      permissions |= value;
    }
    return permissions;
  }
}

export { PermissionBits };
