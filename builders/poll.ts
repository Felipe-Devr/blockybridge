import Client from 'djs/client';
import { PollResults, User } from 'djs/structures';
import { PollAnswer, PollFetchOptions, PollMedia, RawMessage, RawUser, Routes } from 'djs/types';

// TODO: Add a more clean results way
class Poll {
  private client: Client;
  private channel: string;
  public id: string;
  public title: PollMedia;
  public options: PollAnswer[] = [];
  public duration: number = 24;
  public allowMultiSelection: boolean = false;
  public expiry?: Date;

  public constructor(client: Client, channel: string, data?: RawMessage) {
    this.client = client;

    if (!data) return;
    const { question, answers, duration, allow_multiselect, layout_type: _, expiry } = data.poll;
    this.id = data.id;
    this.channel = channel;
    this.title = question;
    this.options = answers.map((answer) => ({
      answerId: answer.answer_id,
      pollMedia: answer.poll_media,
    }));
    this.duration = duration;
    this.allowMultiSelection = allow_multiselect;
    this.expiry = expiry ? new Date(expiry) : undefined;
  }

  public async end(): Promise<PollResults> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.channel}/polls/${this.id}/expire`,
      'Post',
    );

    if (response.status != 200) return;
    const rawPoll = (JSON.parse(response.body) as RawMessage).poll!;

    if (!rawPoll.results) return;
    return new PollResults(rawPoll.results.answer_counts);
  }

  public async fetchVotes(answerId: number, options?: PollFetchOptions): Promise<Array<User>> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.channel}/polls/${this.id}/answers/${answerId}`,
      'Get',
      options ? JSON.stringify(options) : undefined,
    );

    if (response.status != 200) return [];
    const rawUsers = JSON.parse(response.body) as Array<RawUser>;
    const users = rawUsers.map((rawUser) => new User(this.client, rawUser));

    return users;
  }

  public setQuestion(question: string): this {
    this.title = {
      text: question,
    };
    return this;
  }

  public addOption(option: PollAnswer): this {
    this.options.push({
      answerId: this.options.length,
      ...option,
    });
    return this;
  }

  public setAllowMultiSelection(allow: boolean): this {
    this.allowMultiSelection = allow;
    return this;
  }

  public setDuration(duration: number): this {
    this.duration = Math.min(duration, 24 * 32);
    return this;
  }

  public toJSON(): string {
    return JSON.stringify({
      question: this.title,
      answers: this.options.map((option, idx) => ({
        answer_id: idx,
        poll_media: option.pollMedia,
      })),
      duration: this.duration,
      allow_multiselect: this.allowMultiSelection,
      layout_type: 1,
    });
  }
}

export { Poll };
