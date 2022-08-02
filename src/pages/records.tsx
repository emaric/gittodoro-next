import ClockBase from '@/components/clock/ClockBase'
import ClockRecordsRing from '@/components/clock/ClockRecordsRing'
import { useGithubAuth } from '@/context/GithubAuthContextProvider'
import { Clock } from '@/models/Clock'
import { Record } from '@/models/Record'
import { Session } from '@/models/Session'
import { fromISO } from '@/modules/temporal/DateTime'
import fetcher from '@/modules/swr/fetcher'
import React from 'react'
import useSWR from 'swr'

type RecordsAPIType = {
  sessions: Session[],
  records: Record[]
}

const RecordsPage = () => {
  const start = fromISO('2022-05-26')
  const end = start.add({ days: 1 })
  const clock = new Clock(start, end)
  const { user } = useGithubAuth()
  const { data, error } = useSWR<RecordsAPIType>(user ? [`/api/records/${start.toJSON()}`, user.token] : null, fetcher)

  let records = undefined
  if (data) {
    records = data.records.map(record => {
      const r = new Record({
        state: record.state,
        start: fromISO(String(record.start)),
        end: fromISO(String(record.end))
      })
      return r
    })
    console.log(records)
  }
  return (
    <div>
      {records &&
        <ClockBase>
          <ClockRecordsRing clock={clock} records={records} />
        </ClockBase>
      }
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

export default RecordsPage