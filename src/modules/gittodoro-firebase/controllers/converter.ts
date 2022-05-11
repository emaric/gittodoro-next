import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore'

import { Session } from '@emaric/gittodoro-ts/lib/interactor/entities/Session'
import { Duration } from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'

export const sessionConverter = {
  toFirestore(session: Session): DocumentData {
    return {
      ...session,
      start: Timestamp.fromDate(session.start),
      end: session.end ? Timestamp.fromDate(session.end) : null,
      duration: JSON.parse(JSON.stringify(session.duration)),
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Session {
    const data = snapshot.data(options)!
    return new Session({
      id: data.id,
      start: (data.start as Timestamp).toDate(),
      end: data.end ? (data.end as Timestamp).toDate() : undefined,
      duration: new Duration(data.duration),
    })
  },
}
