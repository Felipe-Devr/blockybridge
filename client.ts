import { http, HttpHeader, HttpRequest, HttpRequestMethod, HttpResponse } from '@minecraft/server-net';
import { ChannelCache } from './caching';
import { GuildCache } from './caching/guilds';
import { ClientDebugEventSignal } from './events';
import { Routes, ClientEvents, RawApp } from './types';
import { system } from '@minecraft/server';
import { Guild, EventEmitter, ClientEventSignal, User } from './structures';
import * as Events from './events';

class Client extends EventEmitter<keyof ClientEvents, ClientEvents[keyof ClientEvents]> {
  // ? The client secret token
  private token: string;

  // ? The client event registry
  public static events: Set<typeof ClientEventSignal> = new Set();

  // ? The client channel cache
  public channels: ChannelCache = new ChannelCache(this);

  //? The client guild cache
  public guilds: GuildCache = new GuildCache(this);

  // ? The client discord user
  public user: User;

  public constructor() {
    super();
  }

  public on<T extends keyof ClientEvents>(event: T, listener: (event: ClientEvents[T]) => void): void {
    super.on(event, listener);
  }

  public once<T extends keyof ClientEvents>(event: T, listener: (event: ClientEvents[T]) => void): void {
    super.once(event, listener);
  }

  public removeListener<T extends keyof ClientEvents>(event: T, listener: (event: ClientEvents[T]) => void): void {
    super.removeListener(event, listener);
  }

  public login(token: string): void {
    this.token = token;

    // In scripting api we dont have websockets, so we cant possibly do some events, like, message, and others.
    this.sendAuthenticatedRequest(`${Routes.Applications}/@me`, 'Get').then(async (response) => {
      if (response.status != 200) throw new Error(`Failed to authenticate with Discord API: ${response.status}`);
      const rawApp = JSON.parse(response.body) as RawApp;
      this.user = new User(this, rawApp.bot);

      this.emit(new Events.ClientReadyEventSignal(this, this.token));
      await this.guilds.fetch();

      for (const cached of this.guilds) {
        const guild = cached instanceof Guild ? cached : await cached.fetch();
        await guild.fetchChannels();
      }

      system.runInterval(async () => {
        for (const event of Client.events) {
          if (this.listeners.get(event.id)?.size == 0) continue;
          event.tick(this);
        }
      }, 20);
      return;
    });
  }

  public async sendAuthenticatedRequest(uri: string, method: string, body?: string): Promise<HttpResponse> {
    const request = new HttpRequest(uri);

    request.method = method as HttpRequestMethod;
    if (body != undefined) request.body = body;
    request.headers = [new HttpHeader('Content-Type', 'application/json'), new HttpHeader('Authorization', `Bot ${this.token}`)];

    const response = await http.request(request);

    this.emit(new ClientDebugEventSignal(`Code: ${response.status} Body: ${response.body.slice(0, 200).trim()}`));
    return response;
  }
}

for (const event of Object.values(Events)) {
  Client.events.add(event as unknown as typeof ClientEventSignal);
}

export { Client };
