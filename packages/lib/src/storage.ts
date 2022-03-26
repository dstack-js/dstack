/* eslint-disable @typescript-eslint/no-misused-new */
export interface Storage<T = { value: string; date: Date }> {
  namespace: string;

  keys(): Promise<string[]>;
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
}

export class InMemoryStorage<T = { value: string; date: Date }>
implements Storage<T> {
  private data: { [key: string]: T } = {}

  constructor(public namespace: string) {}

  public async keys(): Promise<string[]> {
    return Object.keys(this.data)
  }

  public async get(key: string): Promise<T | null> {
    return this.data[key] || null
  }

  public async set(key: string, value: T): Promise<void> {
    this.data[key] = value
  }
}
