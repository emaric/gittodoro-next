import { Clock } from '@/models/Clock'
import { HTTP_STATUS_CODE } from '@/models/constants'
import { Session } from '@/models/Session'
import sessionConverter from '@/modules/firebase-admin/converters/session'
import {
  NextApiRequestWithUid,
  withAuth,
} from '@/modules/firebase-admin/middlewares'
import { UserCollections } from '@/modules/gittodoro-firebase/UserCollections'
import RecordAPI from '@/modules/gittodoro/api/RecordAPI'
import { fromISO } from '@/modules/temporal/DateTime'
import type { NextApiResponse } from 'next'

const handler = async (req: NextApiRequestWithUid, res: NextApiResponse) => {
  const { date } = req.query
  try {
    const startDate = new Date(String(date))
    if (startDate.getTime() > 0 && req.uid) {
      const start = fromISO(String(date))
      const end = start.add({ days: 1 })
      const clock = new Clock(start, end)

      const sessions = await getSessions(req.uid, clock)
      const records = await getRecords(sessions)

      res.status(200).json({ sessions, records })
      return
    } else {
      throw new Error('Invalid date. Expected a YYYY-MM-DD format.')
    }
  } catch (error) {
    console.error(
      `Error encountered while trying to execute request at /api/records/${date}.`,
      error,
      '\n'
    )
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json({ error: (error as Error).message })
    return
  }
}

async function getSessions(uid: string, clock: Clock) {
  const col = new UserCollections(uid)
  const responseStart = await col.sessions
    .where('start', '>=', clock.startDate)
    .where('start', '<', clock.endDate)
    .withConverter(sessionConverter)
    .get()

  let sessions: Session[] = extractSessions(responseStart)

  const responseEnd = await col.sessions
    .where('end', '>=', clock.startDate)
    .where('end', '<', clock.endDate)
    .withConverter(sessionConverter)
    .get()

  const ids = sessions.map((s) => s.id)
  extractSessions(responseEnd).forEach((session) => {
    if (!ids.includes(session.id)) {
      sessions.push(session)
    }
  })

  sessions = sessions.sort((a, b) => a.start.getTime() - b.start.getTime())

  return sessions
}

function extractSessions(
  responseStart: FirebaseFirestore.QuerySnapshot<Session>
) {
  const sessions: Session[] = []

  responseStart.forEach((docSnap) => {
    sessions.push(docSnap.data())
  })
  return sessions
}

async function getRecords(sessions: Session[]) {
  const api = new RecordAPI()
  sessions.forEach(async (session) => {
    if (session.end) {
      const records = await api.createAll(session, session.end)
      console.log('session.records', session, records)
    }
  })
  return await api.createAllForSessions(sessions)
}

export default withAuth(handler)
