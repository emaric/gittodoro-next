import Duration from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'

export default interface DurationGatewayInterface {
  create(
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Duration | undefined>

  readByIDs(ids: string[]): Promise<Duration[]>

  findMatch(
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ): Promise<Duration | undefined>
}
