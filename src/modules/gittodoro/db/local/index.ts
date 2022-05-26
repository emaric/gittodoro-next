import DurationLocalStorageGateway from './DurationLocalStorageGateway'
import { SessionLocalStorageGateway } from './SessionLocalStorageGateway'

class GatewayProvider {
  private duration?: DurationLocalStorageGateway
  private session?: SessionLocalStorageGateway

  get durationGateway() {
    if (this.duration) {
      return this.duration
    }
    this.duration = new DurationLocalStorageGateway()
    return this.duration
  }

  get sessionGateway() {
    if (this.session) {
      return this.session
    }
    this.session = new SessionLocalStorageGateway()
    return this.session
  }
}

const gatewayProvider = new GatewayProvider()
export default gatewayProvider
