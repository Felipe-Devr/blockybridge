import { BaseTextChannel } from './channel';

class TextChannel extends BaseTextChannel {
  // TODO: Optimize this and fix it
  /* public awaitMessages(options: AwaitMessageOptions): Promise<Array<Message>> {
    return new Promise((resolve) => {
      let messages: Array<RawMessage> = [];

      const intervalId = system.runInterval(async () => {
        const lastMessage = await this.messages.getLastMessage();
        const response = await this.client.sendAuthenticatedRequest(
          `${Routes.Channels}/${this.id}/messages?after=${lastMessage.id}`,
          'Get',
        );
        messages = JSON.parse(response.body) as Array<RawMessage>;

        if (messages.length >= options.max) {
          system.clearRun(intervalId);
          return resolve(messages.map((raw) => new Message(this.client, raw)));
        }
      }, 20);

      system.runTimeout(() => {
        system.clearRun(intervalId);
        return resolve(messages.map((raw) => new Message(this.client, raw)));
      }, options.time * TicksPerSecond);
    });
  } */
}

export { TextChannel };
