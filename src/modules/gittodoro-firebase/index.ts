import DurationGatewayInterface from '../gittodoro/db/DurationGatewayInterface'
import DurationLocalStorageGateway from '../gittodoro/db/local/DurationLocalStorageGateway'
import SessionGatewayInterface from '../gittodoro/db/SessionGatewayInterface'
import { SessionFirebaseGateway } from './SessionFirebaseGateway'

class GatewayProvider {
  private duration?: DurationGatewayInterface
  private session?: SessionGatewayInterface

  get sessionGateway() {
    if (this.session == undefined) {
      this.session = new SessionFirebaseGateway()
    }
    return this.session
  }

  get durationGateway() {
    if (this.duration == undefined) {
      this.duration = new DurationLocalStorageGateway()
    }
    return this.duration
  }
}

export const gatewayProvider = new GatewayProvider()
