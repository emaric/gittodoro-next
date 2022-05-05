import { SessionsAPI } from '../gittodoro/api/SessionsAPI'
import { SessionFirebaseGateway } from './SessionFirebaseGateway'

const firebaseDB = new SessionFirebaseGateway()
export const firebaseSessionsAPI = new SessionsAPI(firebaseDB)
