import {
  updateDoc,
  setDoc,
  doc,
  collection,
  getDoc,
  orderBy,
  query,
  limit,
  getDocs,
  where,
  documentId,
  deleteDoc,
} from 'firebase/firestore'

import { Session } from '@emaric/gittodoro-ts/lib/interactor/entities/Session'

import { sessionConverter } from './converter'
import { getUserDocRef } from './users'

const COLLECTION_NAME = 'sessions'

export const getUserSessionsColRef = () => {
  return collection(getUserDocRef(), COLLECTION_NAME)
}

const getUserSessionsDocRef = (id: string) => {
  return doc(getUserSessionsColRef(), id)
}

export const setUserSession = async (id: string, session: Session) => {
  const userDocRef = getUserSessionsDocRef(id)
  const docExists = (await getDoc(userDocRef)).exists()
  const docFunc = docExists ? updateDoc : setDoc
  const sessionDocSnap = await docFunc(
    userDocRef,
    sessionConverter.toFirestore(session)
  )
  return sessionDocSnap
}

export const retrieveSession = async (id: string) => {
  const sessionDoc = await getDoc(doc(getUserSessionsColRef(), id))
  if (sessionDoc.exists()) {
    return sessionConverter.fromFirestore(sessionDoc, {
      serverTimestamps: 'estimate',
    })
  }
  return undefined
}

export const retrieveLatestSession = async () => {
  const q = query(getUserSessionsColRef(), orderBy('start', 'desc'), limit(1))
  const response = await getDocs<Session>(q.withConverter(sessionConverter))
  debugger
  if (response.docs.length > 0 && response.docs[0] != undefined) {
    return response.docs[0].data()
  }
  return undefined
}

export const retrieveLatestActiveSession = async () => {
  const q = query(getUserSessionsColRef(), where('end', '==', null))
  const response = await getDocs<Session>(q.withConverter(sessionConverter))
  if (response.docs.length > 0) {
    return response.docs[response.docs.length - 1].data()
  }
  return undefined
}

export const updateSession = async (session: Session) => {
  await setUserSession(String(session.id), session)
}

export const retrieveOldestSession = async () => {
  const sessionsCollectionRef = getUserSessionsColRef()
  const q = query(sessionsCollectionRef, orderBy('start', 'asc'), limit(1))
  const response = await getDocs<Session>(q.withConverter(sessionConverter))
  if (response.docs && response.docs[0] != undefined) {
    return response.docs[0].data()
  }
  return undefined
}

export const retrieveSessionsByRange = async (start: Date, end: Date) => {
  const sessionsCollectionRef = getUserSessionsColRef()
  const q = query(
    sessionsCollectionRef,
    where('start', '>=', start),
    where('start', '<', end)
  )
  const q2 = query(
    sessionsCollectionRef,
    where('end', '>=', start),
    where('end', '<', end)
  )

  const responseDocIDs = new Set()
  const result: Session[] = []

  const responses = await Promise.all(
    [q, q2].map((_q) => getDocs<Session>(_q.withConverter(sessionConverter)))
  )
  responses.forEach((response) => {
    response.docs.forEach((doc) => {
      if (!responseDocIDs.has(doc.id)) {
        result.push(doc.data())
      }
      responseDocIDs.add(doc.id)
    })
  })
  return result
}

export const retrieveSessionsByIDs = async (
  ids: string[]
): Promise<Session[]> => {
  if (ids.length <= 10) {
    const q = query(getUserSessionsColRef(), where(documentId(), 'in', ids))
    const response = await getDocs<Session>(q.withConverter(sessionConverter))
    return response.docs.map((_doc) => _doc.data())
  }
  throw new Error(
    'Not yet implemented. TODO: execute by batch when size exceeds 10.'
  )
}

export const saveSessions = async (ids: string[], sessions: Session[]) => {
  await Promise.all(
    sessions.map((session, i) =>
      setDoc(
        getUserSessionsDocRef(ids[i]),
        sessionConverter.toFirestore(session)
      )
    )
  )
}

export const deleteSessionsByIDs = async (ids: string[]) => {
  await Promise.all(ids.map((id) => deleteDoc(getUserSessionsDocRef(id))))
}
