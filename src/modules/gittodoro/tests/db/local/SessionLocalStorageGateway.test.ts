import gatewayProvider from '@/modules/gittodoro/db/local'
import { SessionLocalStorageGateway } from '@/modules/gittodoro/db/local/SessionLocalStorageGateway'

import '@/modules/gittodoro/tests/MockLocalStorage'

describe('[SessionLocalStorageGateway] unit tests', () => {
  describe('when trying to create sessions', () => {
    const gateway = gatewayProvider.sessionGateway
    const date = new Date('2022-04-15T00:01:00.000Z')
    let expectedSession: any
    it('should save to the localstorage as a json string list', async () => {
      expectedSession = await gateway.createWithDuration([
        {
          start: date,
          pomodoro: 50,
          short: 5,
          long: 15,
          interval: 4,
        },
      ])

      const actual = localStorage.getItem(
        SessionLocalStorageGateway.SESSIONS_ID
      )
      const expected =
        '[{"id":"0","duration":{"id":"0","pomodoro":50,"short":5,"long":15,"interval":4},"start":"2022-04-15T00:01:00.000Z"}]'

      expect(actual).toBe(expected)
    })

    it('should be able to load the sessions in range', async () => {
      const sessionResponse = await gateway.readByRange(
        new Date('2022-04-15T00:01:00.000Z'),
        new Date('2022-04-15T00:01:00.005Z')
      )
      expect(sessionResponse).toEqual(expectedSession)
    })

    it('should be able to load the first session', async () => {
      const first = await gateway.first()
      expect(first).toEqual(gateway.sessions[0])
    })
  })
})
