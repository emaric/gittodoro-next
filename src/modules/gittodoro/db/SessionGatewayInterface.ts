import {
  CreateSessionsGatewayInterface,
  DeleteSessionsGatewayInterface,
  ReadFirstSessionGatewayInterface,
  ReadSessionsGatewayInterface,
  StartSessionGatewayInterface,
  StopSessionGatewayInterface,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/data.gateway'

export default interface SessionGatewayInterface
  extends StartSessionGatewayInterface,
    StopSessionGatewayInterface,
    CreateSessionsGatewayInterface,
    ReadSessionsGatewayInterface,
    ReadFirstSessionGatewayInterface,
    DeleteSessionsGatewayInterface {}
