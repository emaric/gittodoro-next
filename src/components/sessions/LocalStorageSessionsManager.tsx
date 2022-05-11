import { useEffect, useMemo, useState } from "react"

import { difference } from "@/modules/temporal/DateTime"

import { Session } from "@/models/Session"
import { useLocalStorageAPI } from "@/context/gittodoro/LocalStorageAPIContextProvider"

import styles from './LocalStorageSessionsManager.module.css'

const LocalStorageSessionsManager = () => {
  const { localSessionsAPI } = useLocalStorageAPI()
  const [localSessions, setLocalSessions] = useState<Session[]>([])
  const groups = useMemo(() => {
    const byStartDate: string[] = []
    localSessions.forEach((session) => {
      const plainDate = session.startPlainDateTime.toPlainDate().toString()
      if (!byStartDate.includes(plainDate))
        byStartDate.push(plainDate)
    })
    return byStartDate
  }, [localSessions])

  useEffect(() => {
    if (localSessionsAPI) {
      const start = new Date('2022-01-01')
      const end = new Date()
      localSessionsAPI.viewByRange(start, end).then(({ sessions }) => {
        if (sessions) {
          setLocalSessions(sessions.map(session => new Session(session)))
        }
      })
    }
  }, [localSessionsAPI])

  return (
    <div>
      {groups.map(group =>
        <GroupedByStartDate key={group} date={group} sessions={localSessions} />
      )}
    </div>
  )
}

const GroupedByStartDate = (props: { date: string, sessions: Session[] }) => {
  const filtered = useMemo(() => {
    return props.sessions.filter((session) => session.startPlainDateTime.toPlainDate().toString() == props.date)
  }, [props.sessions, props.date])
  return (
    <section className={styles.group}>
      <header>{props.date}<button>save all</button></header>
      {filtered.map(session => <SessionComponent key={session.id} session={session} />)}
    </section>
  )
}

const SessionComponent = (props: { session: Session }) => {
  const duration = useMemo(() => props.session.endPlainDateTime && difference(props.session.endPlainDateTime, props.session.startPlainDateTime), [props.session])
  const hours = useMemo(() => duration && Math.floor(duration / (60 * 60)), [duration])
  const minutes = useMemo(() => duration && Math.floor(duration / 60) % 60, [duration])
  const seconds = useMemo(() => duration && Math.floor(duration % 60), [duration])
  return (
    <div>
      <button>save</button>
      <button>delete</button>
      Duration: {duration} seconds ({hours} hours {minutes} minutes, {seconds} seconds)
    </div>
  )
}

export default LocalStorageSessionsManager