import { useEffect, useMemo, useState } from "react"

import { difference } from "@/modules/temporal/DateTime"

import { Session } from "@/models/Session"
import { useLocalStorageAPI } from "@/context/gittodoro/LocalStorageAPIContextProvider"

import styles from './LocalStorageSessionsManager.module.css'

import * as Button from './buttons'

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
    <div className={styles.container}>
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
      <header>
        <h3>{props.date}</h3>
        <div className={styles.header_buttons}>
          <button>Upload All</button>
          <button>Delete All</button>
        </div>
      </header>
      <div className={styles.groups_container}>
        {filtered.map(session => <SessionComponent key={session.id} session={session} />)}
      </div>
    </section>
  )
}

const SessionComponent = (props: { session: Session }) => {
  const duration = useMemo(() => props.session.endPlainDateTime && difference(props.session.endPlainDateTime, props.session.startPlainDateTime), [props.session])
  const hours = useMemo(() => duration && Math.floor(duration / (60 * 60)), [duration])
  const minutes = useMemo(() => duration && Math.floor(duration / 60) % 60, [duration])
  const seconds = useMemo(() => duration && Math.floor(duration % 60), [duration])
  return (
    <div className={styles.session_container}>
      <div className={styles.items}>
        <div className={styles.item}>
          <label>Duration:</label> {duration && `${hours} hr ${minutes} min, ${seconds} sec`}
        </div>
        <div className={styles.item}>
          <label>Start:</label>{props.session.startPlainDateTime.toLocaleString()}
        </div>
        <div className={styles.item}>
          <label>End:</label>{props.session.endPlainDateTime?.toLocaleString()}
        </div>
      </div>
      <div className={styles.buttons}>
        <Button.Upload />
        <Button.Delete />
      </div>
    </div>
  )
}

export default LocalStorageSessionsManager