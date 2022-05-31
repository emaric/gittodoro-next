import Duration from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'
import DurationGatewayInterface from '@/gittodoro/db/DurationGatewayInterface'

export default class DurationFirebaseGateway
  implements DurationGatewayInterface
{
  getDefaultDuration(): Promise<Duration> {
    throw new Error('Method not implemented.')
  }

  updateDefaultDuration(
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Duration> {
    throw new Error('Method not implemented.')
  }

  resetDefaultDuration(): Promise<Duration> {
    throw new Error('Method not implemented.')
  }

  create(
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Duration | undefined> {
    throw new Error('Method not implemented.')
  }

  readByIDs(ids: string[]): Promise<Duration[]> {
    throw new Error('Method not implemented.')
  }

  findMatch(
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Duration | undefined> {
    throw new Error('Method not implemented.')
  }
}
