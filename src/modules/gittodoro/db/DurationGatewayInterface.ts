import Duration from '@emaric/gittodoro-ts/lib/interactor/entities/Duration'
import {
  ReadDefaultDurationDataGatewayInterface,
  ResetDefaultDurationDataGatewayInterface,
  UpdateDefaultDurationDataGatewayInterface,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/io/data.gateway'

export default interface DurationGatewayInterface
  extends ReadDefaultDurationDataGatewayInterface,
    UpdateDefaultDurationDataGatewayInterface,
    ResetDefaultDurationDataGatewayInterface {
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
