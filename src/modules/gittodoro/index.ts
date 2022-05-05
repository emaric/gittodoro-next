import { SessionsAPI } from './api/SessionsAPI'
import { SessionLocalStorageGateway } from './db/local/SessionLocalStorageGateway'

const localDB = new SessionLocalStorageGateway()
export const localSessionsAPI = new SessionsAPI(localDB)
