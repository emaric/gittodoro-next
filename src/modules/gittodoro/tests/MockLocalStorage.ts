export class MockLocalStorage implements Storage {
  store: any
  length: number;
  [name: string]: any

  constructor() {
    this.store = {}
    this.length = 0
  }

  key(index: number): string | null {
    throw new Error('Method not implemented.')
  }

  clear() {
    this.store = {}
  }

  getItem(key: string): string {
    return this.store[key] || null
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value)
  }

  removeItem(key: string) {
    delete this.store[key]
  }
}

global.localStorage = new MockLocalStorage()
