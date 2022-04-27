import { CircularLinkedList } from './CircularLinkedList'
import { StateTimer } from './StateTimer'

export class Session {
  id: number
  start: Date
  end?: Date
  timerSequence: StateTimer[]
  private circularLinkedTimerSequence: CircularLinkedList<StateTimer>

  constructor(params: {
    id: number
    start: Date
    end?: Date
    timerSequence: StateTimer[]
  }) {
    this.id = params.id
    this.start = params.start
    this.end = params.end
    this.timerSequence = params.timerSequence
    this.circularLinkedTimerSequence = new CircularLinkedList(
      params.timerSequence
    )
  }

  get timer(): StateTimer {
    return this.circularLinkedTimerSequence.current
  }

  switchTimer(): StateTimer {
    return this.circularLinkedTimerSequence.next()
  }
}
