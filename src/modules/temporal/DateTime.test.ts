import * as DateTime from './DateTime'

describe('[DateTime] unit tests', () => {
  it('now', () => {
    const utcDateTime = new Date()
    const tzDateTimeString = new Date(
      utcDateTime.getTime() - utcDateTime.getTimezoneOffset() * 60000
    ).toISOString()

    const expected = tzDateTimeString.slice(0, 19)
    const actual = DateTime.now().toString().slice(0, 19)

    expect(actual).toBe(expected)
  })

  it('today', () => {
    const utcDateTime = new Date()
    const tzDateTimeString = new Date(
      utcDateTime.getTime() - utcDateTime.getTimezoneOffset() * 60000
    ).toISOString()

    const expected = tzDateTimeString.slice(0, 10) + 'T00:00:00'
    const actual = DateTime.today().toString()

    expect(actual).toBe(expected)
  })

  it('tomorrow', () => {
    const utcDateTime = new Date()
    const tzDateTimeString = new Date(
      24 * 60 * 60 * 1000 +
        (utcDateTime.getTime() - utcDateTime.getTimezoneOffset() * 60000)
    ).toISOString()

    const expected = tzDateTimeString.slice(0, 10) + 'T00:00:00'
    const actual = DateTime.tomorrow().toString()

    expect(actual).toBe(expected)
  })

  it('difference', () => {
    const date1 = new Date()
    const date2 = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000)
    const diff = (date2.getTime() - date1.getTime()) / 1000

    const utc = DateTime.utc()
    const actual = DateTime.difference(DateTime.now(), utc)
    expect(Math.round(actual)).toBe(diff)
  })

  it('difference today and tomorrow', () => {
    expect(DateTime.difference(DateTime.today(), DateTime.tomorrow())).toBe(
      -24 * 60 * 60
    )
  })

  it('fromISO', () => {
    // ISO 8601 - International Organization for Standardization (ISO)
    const isoDateTime = '2022-01-01T00:00:30'
    const isoDateTime2 = '2022-01-01T00:00:00'

    const expected = 30
    const actual = DateTime.difference(
      DateTime.fromISO(isoDateTime),
      DateTime.fromISO(isoDateTime2)
    )

    expect(actual).toBe(expected)
  })

  it('fromUTC', () => {
    const now = new Date('2022-04-20T14:54:08.088Z')
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000)
    const expected = local.toISOString().replace('Z', '')
    expect(DateTime.fromUTC(now).toString()).toBe(expected)
  })
})
