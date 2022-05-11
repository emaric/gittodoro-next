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
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

import { Session } from '@emaric/gittodoro-ts/lib/interactor/entities/Session'

import { db } from '@/modules/firebase'
import { sessionConverter } from './converter'

const getUserDocRef = () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    return doc(collection(db, 'users'), user.uid)
  } else {
    throw new Error(
      'Error on `sessions.retrieveSession(...)`. User authentication required.'
    )
  }
}

export const getUserData = async () => {
  const userData = await getDoc(getUserDocRef())
  if (userData.exists()) {
    return userData.data()
  } else {
    throw new Error('Error on `sessions.getUserData()`. No user data found.')
  }
}

export const getUserSessionsColRef = () => {
  return collection(getUserDocRef(), 'sessions')
}

const getUserSessionsDocRef = (id: string) => {
  const sessionsCollection = getUserSessionsColRef()
  if (sessionsCollection) {
    const sessionsDocRef = doc(sessionsCollection, id)
    return sessionsDocRef
  }
}

export const setUserSession = async (id: string, session: Session) => {
  const userDocRef = getUserSessionsDocRef(id)
  if (userDocRef) {
    const docExists = (await getDoc(userDocRef)).exists()
    const docFunc = docExists ? updateDoc : setDoc
    const sessionDocSnap = await docFunc(
      userDocRef,
      sessionConverter.toFirestore(session)
    )
    return sessionDocSnap
  }
  throw new Error('Error trying to create session.')
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
  if (response.docs.length > 0) {
    return response.docs[0].data()
  }
  return undefined
}

export const retrieveLatestActiveSession = async () => {
  const q = query(getUserSessionsColRef(), where('end', '==', null))
  const response = await getDocs<Session>(q.withConverter(sessionConverter))
  if (response.docs.length > 0) {
    return response.docs[0].data()
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
  if (response.docs) {
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
