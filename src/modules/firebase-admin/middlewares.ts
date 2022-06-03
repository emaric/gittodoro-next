import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/modules/firebase-admin'

export type NextApiRequestWithUid = NextApiRequest & {
  uid?: string
}

export const withAuth = (handler: CallableFunction) => {
  return async (req: NextApiRequestWithUid, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    if (authHeader == undefined) {
      return res.status(401).end('Not authenticated. No Auth header')
    }

    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(token)
      if (decodedToken == undefined || decodedToken.uid == undefined) {
        return res.status(401).end('Not authenticated')
      }
      req.uid = decodedToken.uid
    } catch (error) {
      console.error('Error in withAuth middleware.', error)
      return res.status(500).json({ error })
    }

    return handler(req, res)
  }
}
