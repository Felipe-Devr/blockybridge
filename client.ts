import { http, HttpHeader, HttpRequest, HttpRequestMethod, HttpResponse } from '@minecraft/server-net';
import { ChannelCache } from './caching';
import { GuildCache } from './caching/guilds';
import { EventEmitter } from './structures/emitter';
import { ClientEvents, ClientReadyEventSignal } from './events';
import { Routes } from './types';

class Client extends EventEmitter<keyof ClientEvents, ClientEvents[keyof ClientEvents]> {
  private token: string;
  public channels: ChannelCache = new ChannelCache(this);
  public guilds: GuildCache = new GuildCache(this);

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
    this.sendAuthenticatedRequest(`${Routes.Applications}/@me`, 'Get').then((response) => {
      if (response.status == 200) {
        this.emit(new ClientReadyEventSignal(this, this.token));
        return;
      }
      throw new Error(`Failed to authenticate with Discord API: ${response.status}`);
    });
  }

  public sendAuthenticatedRequest(uri: string, method: string, body?: string): Promise<HttpResponse> {
    const request = new HttpRequest(uri);

    request.method = method as HttpRequestMethod;
    if (body != undefined) request.body = body;
    request.headers = [new HttpHeader('Content-Type', 'application/json'), new HttpHeader('Authorization', `Bot ${this.token}`)];

    return http.request(request);
  }
}

export default Client;
