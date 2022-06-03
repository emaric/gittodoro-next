import { gatewayProvider } from '@/modules/gittodoro-firebase'
import { NotesAPI } from '@/modules/gittodoro/api/NotesAPI'
import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const api = new NotesAPI(gatewayProvider.noteGateway)
  const test = await api.readFirst()
  console.log('test', test)
  res.status(200).json({ name: 'John Doe' })
}
