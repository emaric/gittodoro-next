import Duration, {
  defaultDuration,
} from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'
import DurationGatewayInterface from '../DurationGatewayInterface'

const mapToEntity = (durationsString: string): Duration[] => {
  const objs = JSON.parse(durationsString)
  return objs.map(
    (obj: any) =>
      new Duration(obj.id, obj.pomodoro, obj.short, obj.long, obj.interval)
  )
}

const mapToString = (durations: Duration[]) => {
  return JSON.stringify(durations)
}

export default class DurationLocalStorageGateway
  implements DurationGatewayInterface
{
  static DURATIONS_ID = 'gittodoro-durations'
  static DURATIONS_LAST_ID = 'gittodoro-durations-last-id'

  constructor() {
    const { pomodoro, short, long, interval } = defaultDuration
    this.create(pomodoro, short, long, interval).catch((error) => {
      console.error(error)
    })
  }

  private get durations() {
    const durations = localStorage.getItem(
      DurationLocalStorageGateway.DURATIONS_ID
    )
    if (durations) {
      return mapToEntity(durations)
    }
    return []
  }

  private updateDurations(durations: Duration[]) {
    localStorage.setItem(
      DurationLocalStorageGateway.DURATIONS_ID,
      mapToString(durations)
    )
  }

  private get lastID() {
    const lastIDString = localStorage.getItem(
      DurationLocalStorageGateway.DURATIONS_LAST_ID
    )
    if (lastIDString) {
      return Number(lastIDString)
    } else {
      return -1
    }
  }

  private updateLastID(id: string) {
    localStorage.setItem(DurationLocalStorageGateway.DURATIONS_LAST_ID, id)
  }

  create(pomodoro: number, short: number, long: number, interval: number) {
    const id = String(this.lastID + 1)
    const duration = new Duration(id, pomodoro, short, long, interval)

    this.updateDurations(this.durations.concat(duration))
    this.updateLastID(id)
    return Promise.resolve(duration)
  }

  readByIDs(ids: string[]): Promise<Duration[]> {
    const durations = this.durations.filter((d) => ids.includes(d.id))
    return Promise.resolve(durations)
  }

  findMatch(pomodoro: number, short: number, long: number, interval: number) {
    return Promise.resolve(
      this.durations.find(
        (d) =>
          d.pomodoro == pomodoro &&
          d.short == short &&
          d.long == long &&
          d.interval == interval
      )
    )
  }
}
