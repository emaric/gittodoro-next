import sessionConverter from '@/modules/firebase-admin/converters/session'
import {
  NextApiRequestWithUid,
  withAuth,
} from '@/modules/firebase-admin/middlewares'
import { UserCollections } from '@/modules/gittodoro-firebase/UserCollections'
import RecordAPI from '@/modules/gittodoro/api/RecordAPI'
import type { NextApiResponse } from 'next'

const handler = async (req: NextApiRequestWithUid, res: NextApiResponse) => {
  if (req.uid) {
    const col = new UserCollections(req.uid)
    const response = await col.sessions
      .where('end', '==', null)
      .orderBy('start', 'desc')
      .limit(1)
      .withConverter(sessionConverter)
      .get()

    let session = undefined
    response.forEach(async (docSnap) => {
      session = docSnap.data()
    })

    if (session) {
      const api = new RecordAPI()
      const records = await api.createAll(session, new Date())
      res.status(200).json({ records })
      return
    }
  }

  res.status(200).json({ uid: req.uid })
  return
}

export default withAuth(handler)
