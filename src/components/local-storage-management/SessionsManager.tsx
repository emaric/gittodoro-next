import { useCallback, useMemo } from "react"

import { difference } from "@/modules/temporal/DateTime"
import { Session } from "@/models/Session"

import { SessionsProvider, useLocalSessions } from "@/context/local-storage-management/SessionsContextProvider"

import styles from './SessionsManager.module.css'

import * as Button from './buttons'
import { confirmAction, confirmDelete } from "@/modules/notiflix"

const SessionsManager = () => {
  const { localSessions } = useLocalSessions()

  const groups = useMemo(() => {
    const byStartDate: string[] = []
    localSessions.forEach((session) => {
      const plainDate = session.startPlainDateTime.toPlainDate().toString()
      if (!byStartDate.includes(plainDate))
        byStartDate.push(plainDate)
    })
    return byStartDate.reverse()
  }, [localSessions])

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

  const { handleDelete, handleUpload } = useLocalSessions()

  const handleDeleteAll = useCallback(() => {
    confirmDelete({ onDelete: () => handleDelete(filtered) })
  }, [filtered, handleDelete])

  const handleUploadAll = useCallback(() => {
    confirmAction({
      title: 'Confirm Upload',
      message: 'Are you sure you want to upload all these sessions?',
      callback: () => handleUpload(filtered)
    })
  }, [filtered, handleUpload])

  return (
    <section className={styles.group}>
      <header>
        <h3>{props.date}</h3>
        <div className={styles.header_buttons}>
          <button onClick={handleUploadAll}>Upload All</button>
          <button onClick={handleDeleteAll}>Delete All</button>
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

  const { handleDelete, handleUpload } = useLocalSessions()

  const onDelete = useCallback(() => {
    handleDelete([props.session])
  }, [props.session, handleDelete])

  const onUpload = useCallback(() => {
    handleUpload([props.session])
  }, [props.session, handleUpload])

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
        <Button.Upload onClick={onUpload} />
        <Button.Delete onClick={onDelete} />
      </div>
    </div>
  )
}

const SessionsManagerContainer = () => {
  return (
    <SessionsProvider>
      <SessionsManager />
    </SessionsProvider>
  )
}

export default SessionsManagerContainer