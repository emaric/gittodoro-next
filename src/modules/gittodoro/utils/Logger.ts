export default class Logger {
  readonly name: string

  constructor(name: string) {
    this.name = name
  }

  log(message?: string, ...subtexts: string[]) {
    const dateTag = new Date().toJSON()
    console.log(
      dateTag + ' [' + this.name + '] ' + message,
      '\n',
      ...subtexts,
      '\n'
    )
  }
}
