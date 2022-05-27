import { Duration } from '@/modules/gittodoro/models/Duration'
import SessionLocalStorageAPI from '@/modules/gittodoro/api/SessionLocalStorageAPI'

import '../MockLocalStorage'

describe('[SessionLocalStorageAPI] unit tests', () => {
  const api = new SessionLocalStorageAPI()
  const sampleDuration: Duration = {
    pomodoro: 10,
    short: 2,
    long: 5,
    interval: 4,
  }
  const log = jest.fn()
  console.log = log

  const lastLineFromOutput = (log: jest.Mock<any, any>): string => {
    return log.mock.calls.at(-1).join('\n')
  }

  const expected = {
    id: '0',
    start: new Date(),
  }

  describe('when trying to start session', () => {
    it('should display started session details', async () => {
      await api.start(sampleDuration, expected.start)
      expect(lastLineFromOutput(log).includes(JSON.stringify(expected))).toBe(
        true
      )
    })
  })

  describe('when trying to end session', () => {
    it('should display stopped session details', async () => {
      const end = new Date()
      await api.stop(end)
      const expectedString = JSON.stringify({ ...expected, end })
      expect(lastLineFromOutput(log).includes(expectedString)).toBe(true)
    })
  })

  describe('when trying to load sessions by range', () => {
    const sample1 = {
      start: new Date('2022-04-17T09:00:00Z'),
      end: new Date('2022-04-17T17:00:00Z'),
      id: '1',
    }
    const sample2 = {
      start: new Date('2022-04-17T18:00:00Z'),
      end: new Date('2022-04-18T01:00:00Z'),
      id: '2',
    }

    const sample1Output = { ...expected, ...sample1 }
    const sample2Output = { ...expected, ...sample2 }

    it('should display the sessions that started on and after the given start datetime but before the end datetime', async () => {
      await api.start(sampleDuration, sample1.start)
      await api.stop(sample1.end)

      await api.start(sampleDuration, sample2.start)
      await api.stop(sample2.end)

      const start = new Date('2022-04-17T00:00:00Z')
      const end = new Date('2022-04-18T00:00:00Z')
      await api.readByRange(start, end)

      const expectedString = [sample1Output, sample2Output]
        .map((s) => JSON.stringify(s))
        .join('\n')
      expect(lastLineFromOutput(log).includes(expectedString)).toBe(true)
    })
    it('should display the sessions that ended before the given end datetime', async () => {
      const start = new Date('2022-04-18T00:00:00Z')
      const end = new Date('2022-04-19T00:00:00Z')
      await api.readByRange(start, end)

      const expectedString = JSON.stringify(sample2Output)
      expect(lastLineFromOutput(log).includes(expectedString)).toBe(true)
    })
  })
})
