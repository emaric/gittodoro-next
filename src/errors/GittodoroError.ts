export default class GittodoroError extends Error {
  readonly errors: Error[]

  constructor(message?: string, ...errors: Error[]) {
    super(`${message}\n\n${errors.map((e) => e.message).join('\n- ')}`)
    this.errors = errors
  }
}
