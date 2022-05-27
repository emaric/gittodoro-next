import SessionPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/SessionPresenterInterface'
import SessionGatewayInterface from '../db/SessionGatewayInterface'
import { Session } from '@/modules/gittodoro/models/Session'

export default interface SessionModelInterface {
  readonly dataGateway: SessionGatewayInterface

  readonly startPresenter: SessionPresenterInterface
  readonly stopPresenter: SessionPresenterInterface
  readonly createPresenter: SessionPresenterInterface
  readonly readPresenter: SessionPresenterInterface
  readonly readFirstPresenter: SessionPresenterInterface
  readonly deletePresenter: SessionPresenterInterface

  started?: Session
  stopped?: Session
  created: Session[]
  read: Session[]
  first?: Session
  deleted: Session[]
}
