import { Duration } from '@/models/Duration'

const durationConverter = {
  toFirestore(duration: Duration): FirebaseFirestore.DocumentData {
    return {
      id: duration.id,
      pomodoro: duration.pomodoro,
      short: duration.short,
      long: duration.long,
      interval: duration.interval,
    }
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Duration {
    const data = snapshot.data()
    return {
      id: data.id,
      pomodoro: data.pomodoro,
      short: data.short,
      long: data.long,
      interval: data.interval,
    }
  },
}

export default durationConverter
