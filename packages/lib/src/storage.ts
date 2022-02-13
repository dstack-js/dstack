export class Storage<T = { value: string; date: Date }> {
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
