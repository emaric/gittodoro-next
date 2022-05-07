import { NotesAPI } from './api/NotesAPI'
import { SessionsAPI } from './api/SessionsAPI'
import { NoteLocalStorageGateway } from './db/local/NoteLocalStorageGateway'
import { SessionLocalStorageGateway } from './db/local/SessionLocalStorageGateway'

const localSessionsDB = new SessionLocalStorageGateway()
export const localSessionsAPI = new SessionsAPI(localSessionsDB)

const localNotesDB = new NoteLocalStorageGateway()
export const localNotesAPI = new NotesAPI(localNotesDB)
