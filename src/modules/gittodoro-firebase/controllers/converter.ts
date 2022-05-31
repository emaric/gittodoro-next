import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore'

import Session from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import Duration from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'
import Note from '@emaric/gittodoro-ts/lib/interactor/entities/Note'

export const sessionConverter = {
  toFirestore(session: Session): DocumentData {
    const { id: durationId, pomodoro, short, long, interval } = session.duration
    return {
      id: String(session.id),
      start: Timestamp.fromDate(session.start),
      end: session.end ? Timestamp.fromDate(session.end) : null,
      duration: {
        id: durationId,
        pomodoro,
        short,
        long,
        interval,
      },
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Session {
    const data = snapshot.data(options)!
    const { id, pomodoro, short, long, interval } = data.duration
    return new Session(
      data.id,
      new Duration(id, pomodoro, short, long, interval),
      (data.start as Timestamp).toDate(),
      data.end ? (data.end as Timestamp).toDate() : undefined
    )
  },
}

export const noteConverter = {
  toFirestore(note: Note): DocumentData {
    return {
      ...note,
      date: Timestamp.fromDate(note.date),
      updatedAt: Timestamp.fromDate(note.updatedAt || note.date),
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Note {
    const data = snapshot.data(options)!
    return {
      id: data.id,
      content: data.content,
      date: (data.date as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    }
  },
}
