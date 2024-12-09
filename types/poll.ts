interface PollMedia {
  text?: string;
  emoji?: unknown; // TODO: Implement Emoji interface
}

interface PollAnswer {
  answerId?: number;
  pollMedia: PollMedia;
}

interface PollRequest {
  question: PollMedia;
  answers?: Array<PollAnswer>;
  expiry: Date;
  allowMultiselect: boolean;
  layoutType: PollLayoutType;
}

interface PollResults {
  [x: number]: number;
}

// HUH?
enum PollLayoutType {
  Default = 1,
}

export { PollRequest, PollAnswer, PollMedia, PollResults };
