import Client from 'djs/client';

class BaseCache<K, V> {
  protected cache: Map<K, V> = new Map();
  protected client: Client;

  public constructor(client: Client) {
    this.client = client;
  }
}

export { BaseCache };
