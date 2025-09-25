export interface LRUEntry<T> {
  key: string;
  value: T;
  size: number;
  timestamp: number;
}

export class LRUCache<T> {
  private readonly limit: number;
  private entries = new Map<string, LRUEntry<T>>();
  private totalSize = 0;

  constructor(limit: number) {
    this.limit = limit;
  }

  set(key: string, value: T, size: number) {
    const entry: LRUEntry<T> = { key, value, size, timestamp: Date.now() };
    const existing = this.entries.get(key);
    if (existing) {
      this.totalSize -= existing.size;
    }
    this.entries.set(key, entry);
    this.totalSize += size;
    this.evict();
  }

  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    entry.timestamp = Date.now();
    this.entries.set(key, entry);
    return entry.value;
  }

  private evict() {
    if (this.totalSize <= this.limit) return;
    const sorted = Array.from(this.entries.values()).sort((a, b) => a.timestamp - b.timestamp);
    for (const entry of sorted) {
      if (this.totalSize <= this.limit) break;
      this.entries.delete(entry.key);
      this.totalSize -= entry.size;
    }
  }

  size(): number {
    return this.totalSize;
  }

  keys(): string[] {
    return Array.from(this.entries.keys());
  }
}
