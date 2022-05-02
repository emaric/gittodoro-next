import { SessionController } from '@/modules/gittodoro/controllers/SessionController'
import { SessionViewInterface } from '@/modules/gittodoro/controllers/presenters/sessions'
import { Session } from '@/modules/gittodoro/models/Session'

import '../MockLocalStorage'

class TestSessionView implements SessionViewInterface {
  updateView(session: Session): void {
    console.log(JSON.stringify(session))
  }
  updateViewSessions(sessions: Session[]): void {
    console.log(JSON.stringify(sessions))
  }
}

describe('[SessionController] unit tests', () => {
  const sampleDuration = {
    pomodoro: 10,
    short: 2,
    long: 5,
    longInterval: 4,
  }
  const log = jest.fn()
  console.log = log

  const lastLineFromOutput = (log: jest.Mock<any, any>): string => {
    return log.mock.calls.at(-1).at(-1)
  }

  const testView = new TestSessionView()
  const controller = new SessionController(testView)

  const expected = {
    id: 0,
    start: new Date(),
    timerSequence: [
      { state: 0, duration: 10 },
      { state: 1, duration: 2 },
      { state: 0, duration: 10 },
      { state: 1, duration: 2 },
      { state: 0, duration: 10 },
      { state: 1, duration: 2 },
      { state: 0, duration: 10 },
      { state: 2, duration: 5 },
    ],
    circularLinkedTimerSequence: [
      { state: 0, duration: 10 },
      { state: 1, duration: 2 },
      { state: 0, duration: 10 },
      { state: 1, duration: 2 },
      { state: 0, duration: 10 },
      { state: 1, duration: 2 },
      { state: 0, duration: 10 },
      { state: 2, duration: 5 },
    ],
  }

  describe('when trying to start session', () => {
    it('should display started session details', () => {
      controller.start(sampleDuration, expected.start)
      expect(lastLineFromOutput(log)).toBe(JSON.stringify(expected))
    })
  })

  describe('when trying to end session', () => {
    it('should display stopped session details', () => {
      const end = new Date()
      controller.stop(end)
      const expectedString = JSON.stringify(new Session({ ...expected, end }))
      expect(lastLineFromOutput(log)).toBe(expectedString)
    })
  })

  describe('when trying to load sessions by range', () => {
    const sample1 = {
      start: new Date('2022-04-17T09:00:00Z'),
      end: new Date('2022-04-17T17:00:00Z'),
      id: 1,
    }
    const sample2 = {
      start: new Date('2022-04-17T18:00:00Z'),
      end: new Date('2022-04-18T01:00:00Z'),
      id: 2,
    }

    const sample1Output = new Session({ ...expected, ...sample1 })
    const sample2Output = new Session({ ...expected, ...sample2 })

    it('should display the sessions that started on and after the given start datetime but before the end datetime', () => {
      controller.start(sampleDuration, sample1.start)
      controller.stop(sample1.end)

      controller.start(sampleDuration, sample2.start)
      controller.stop(sample2.end)

      const start = new Date('2022-04-17T00:00:00Z')
      const end = new Date('2022-04-18T00:00:00Z')
      controller.viewByRange(start, end)

      const expectedString = JSON.stringify([sample1Output, sample2Output])
      expect(lastLineFromOutput(log)).toBe(expectedString)
    })
    it('should display the sessions that ended before the given end datetime', () => {
      const start = new Date('2022-04-18T00:00:00Z')
      const end = new Date('2022-04-19T00:00:00Z')
      controller.viewByRange(start, end)

      const expectedString = JSON.stringify([sample2Output])
      expect(lastLineFromOutput(log)).toBe(expectedString)
    })

    it('should display the first and last sessions', () => {
      const duration = {
        pomodoro: 25,
        short: 5,
        long: 15,
        longInterval: 4,
      }

      const firstStartDate = new Date(`2020-04-01T09:00:00.000Z`)
      controller.start(duration, firstStartDate)
      controller.stop(new Date(`2020-04-01T17:00:00.000Z`))

      controller.viewFirstAndLast()

      const sessions = JSON.parse(lastLineFromOutput(log))

      expect(sessions.length).toBe(2)
      expect(sessions[0].start).toBe(firstStartDate.toJSON())
      expect(sessions[1].start).toBe(expected.start.toJSON())
    })
  })
})
