import { firestore } from '../firebase-admin'

const COLLECTIONS = {
  users: 'users',
  sessions: 'sessions',
  notes: 'notes',
}

export class UserCollections {
  private readonly uid: string

  constructor(uid: string) {
    this.uid = uid
  }

  private get user() {
    return firestore.collection(COLLECTIONS.users).doc(this.uid)
  }

  get sessions() {
    return this.user.collection(COLLECTIONS.sessions)
  }

  session(path: string) {
    return this.sessions.doc(path)
  }

  get notes() {
    return this.user.collection(COLLECTIONS.notes)
  }

  note(path: string) {
    return this.notes.doc(path)
  }
}
