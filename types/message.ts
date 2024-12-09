interface MessageReference {
  type?: MessageReferenceType;
  messageId?: string;
  channelId?: string;
  guildId?: string;
  failIfNotFound?: boolean;
}

enum MessageReferenceType {
  Default,
  Forward,
}

export { MessageReference, MessageReferenceType };
