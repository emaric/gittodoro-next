import { Session } from '../../models/Session'
import { State } from '../../models/State'

describe('[Session] unit tests', () => {
  describe('when tyring to run session timers', () => {
    it('should run the timers indefinitely', () => {
      const sampleSession = new Session({
        id: 0,
        start: new Date(),
        timerSequence: [
          {
            state: State.pomodoro,
            duration: 20,
          },
          {
            state: State.short,
            duration: 5,
          },
          {
            state: State.pomodoro,
            duration: 20,
          },
          {
            state: State.long,
            duration: 15,
          },
        ],
      })

      const expected = [20, 5, 20, 15, 20, 5]

      const actual = expected.map((_, i) => {
        if (i == 0) {
          return sampleSession.timer.duration
        }
        return sampleSession.switchTimer().duration
      })

      expect(actual).toEqual(expected)
    })
  })
})
