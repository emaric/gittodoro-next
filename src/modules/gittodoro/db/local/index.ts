import DurationLocalStorageGateway from './DurationLocalStorageGateway'
import { NoteLocalStorageGateway } from './NoteLocalStorageGateway'
import { SessionLocalStorageGateway } from './SessionLocalStorageGateway'

class GatewayProvider {
  private duration?: DurationLocalStorageGateway
  private session?: SessionLocalStorageGateway
  private note?: NoteLocalStorageGateway

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

  get noteGateway() {
    if (this.note) {
      return this.note
    }
    this.note = new NoteLocalStorageGateway()
    return this.note
  }
}

const gatewayProvider = new GatewayProvider()
export default gatewayProvider
