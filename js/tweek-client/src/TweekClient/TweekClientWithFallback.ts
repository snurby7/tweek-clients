import { GetValuesConfig, ITweekClient } from './types';

export default class TweekClientWithFallback implements ITweekClient {
  constructor(private readonly _clients: ITweekClient[]) {}

  getValues<T>(path: string, config: GetValuesConfig): Promise<T> {
    return this._execute(client => client.getValues(path, config));
  }

  fetch<T>(path: string, config?: GetValuesConfig): Promise<T> {
    return this._execute(client => client.fetch(path, config));
  }

  private _execute<T>(fn: (client: ITweekClient) => Promise<T>): Promise<T> {
    return this._clients.reduce((acc, client) => acc.catch(() => fn(client)), Promise.reject(
      new Error('TweekClientWithFallback has no clients'),
    ) as Promise<T>);
  }
}
