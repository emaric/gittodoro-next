import { Session } from '@/models/Session'
import durationConverter from './duration'

const sessionConverter = {
  toFirestore(session: Session): FirebaseFirestore.DocumentData {
    return {
      id: session.id,
      duration: durationConverter.toFirestore(session.duration),
      start: FirebaseFirestore.Timestamp.fromDate(session.start),
      end:
        session.end == undefined
          ? null
          : FirebaseFirestore.Timestamp.fromDate(session.end),
    }
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const data = snapshot.data()
    return new Session({
      id: data.id,
      duration: {
        id: data.duration.id,
        pomodoro: data.duration.pomodoro,
        short: data.duration.short,
        long: data.duration.long,
        interval: data.duration.interval,
      },
      start: (data.start as FirebaseFirestore.Timestamp).toDate(),
      end: data.end
        ? (data.end as FirebaseFirestore.Timestamp).toDate()
        : undefined,
    })
  },
}

export default sessionConverter
