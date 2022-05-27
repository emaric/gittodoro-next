import { CircularLinkedList } from './CircularLinkedList'
import { StateTimer } from './StateTimer'

export class Session {
  id: string
  start: Date
  end?: Date

  constructor(params: {
    id: string
    start: Date
    end?: Date
    timerSequence: StateTimer[]
  }) {
    this.id = params.id
    this.start = params.start
    this.end = params.end
  }
}
