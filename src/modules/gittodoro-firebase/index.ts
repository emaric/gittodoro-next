import DurationGatewayInterface from '../gittodoro/db/DurationGatewayInterface'
import DurationLocalStorageGateway from '../gittodoro/db/local/DurationLocalStorageGateway'
import NoteGatewayInterface from '../gittodoro/db/NoteGatewayInterface'
import SessionGatewayInterface from '../gittodoro/db/SessionGatewayInterface'
import { NoteFirebaseGateway } from './NotesFirebaseGateway'
import { SessionFirebaseGateway } from './SessionFirebaseGateway'

class GatewayProvider {
  private duration?: DurationGatewayInterface
  private session?: SessionGatewayInterface
  private note?: NoteGatewayInterface

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

  get noteGateway() {
    if (this.note == undefined) {
      this.note = new NoteFirebaseGateway()
    }
    return this.note
  }
}

export const gatewayProvider = new GatewayProvider()
