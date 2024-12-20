import { Client } from '../client';
import { BaseTextChannel, PollResults, User } from '../structures';
import { PollAnswer, PollFetchOptions, PollMedia, RawMessage, RawUser, Routes } from '../types';
import { Message } from './message';

class Poll {
  private client: Client;

  // ? The channel where the poll was sent
  private channelId: string;

  // ? The poll identifier
  public id: string;

  // ? The poll title
  public title: PollMedia;

  // ? The poll options
  public options: Array<PollAnswer> = [];

  //? The poll duration in hours
  public duration: number = 24;

  // ? Wether or not the poll allowsMultiSelection
  public allowMultiSelection: boolean = false;

  // ? The expiry date of the poll
  public expiry?: Date;

  public constructor(client: Client, data?: RawMessage) {
    this.client = client;

    if (!data) return;
    const {
      channel_id: channelId,
      poll: { question, answers, duration, allow_multiselect, layout_type: _, expiry },
    } = data;
    this.channelId = channelId;
    this.id = data.id;
    this.title = question;
    this.options = answers.map((answer) => ({
      answerId: answer.answer_id,
      pollMedia: answer.poll_media,
    }));
    this.duration = duration;
    this.allowMultiSelection = allow_multiselect;
    this.expiry = expiry ? new Date(expiry) : undefined;
  }

  public async send(channel: BaseTextChannel): Promise<Poll> {
    const response = await channel.send(new Message(this.client).addPoll(this));
    return response.getPoll()!;
  }

  /**
   * Ends the poll and retrieves the poll results
   * @returns The poll results
   */
  public async end(): Promise<PollResults> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.channelId}/polls/${this.id}/expire`,
      'Post',
    );

    if (response.status != 200) return;
    const rawPoll = (JSON.parse(response.body) as RawMessage).poll!;

    if (!rawPoll.results) return;
    return new PollResults(rawPoll.results.answer_counts);
  }

  /**
   * Retrieves the list of users that selected the specified answer
   * @param answerId The answer id to retrieve the results
   * @param options The options to fetch the results
   * @returns The Users that selected the answer
   */
  public async fetchVotes(answerId: number, options?: PollFetchOptions): Promise<Array<User>> {
    const response = await this.client.sendAuthenticatedRequest(
      `${Routes.Channels}/${this.channelId}/polls/${this.id}/answers/${answerId}`,
      'Get',
      options ? JSON.stringify(options) : undefined,
    );

    if (response.status != 200) return [];
    const rawUsers = JSON.parse(response.body) as Array<RawUser>;
    const users = rawUsers.map((rawUser) => new User(this.client, rawUser));

    return users;
  }

  /**
   * Modifies the poll title
   * @param question The poll question (title)
   * @returns The poll
   */
  public setQuestion(question: string): this {
    this.title = {
      text: question,
    };
    return this;
  }

  /**
   * Adds a new option to the poll
   * @param option The option to be added
   * @returns The poll
   */
  public addOption(option: PollAnswer): this {
    this.options.push({
      answerId: this.options.length,
      ...option,
    });
    return this;
  }

  public getOption(answerId: number): PollAnswer | undefined {
    return this.options.find((option) => option.answerId === answerId);
  }

  /**
   * Modifies if the poll allows multiple answers
   * @param allow Wether or not the poll allows multiple answer selection
   * @returns
   */
  public setAllowMultiSelection(allow: boolean): this {
    this.allowMultiSelection = allow;
    return this;
  }

  /**
   * Modifies the poll duration
   * @param duration The duration of the poll in hours
   * @returns The poll
   */
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
