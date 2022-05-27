import { Duration } from './Duration'

export class Session {
  id: string
  duration: Duration
  start: Date
  end?: Date

  constructor(params: {
    id: string
    duration: Duration
    start: Date
    end?: Date
  }) {
    this.id = params.id
    this.duration = params.duration
    this.start = params.start
    this.end = params.end
  }
}
