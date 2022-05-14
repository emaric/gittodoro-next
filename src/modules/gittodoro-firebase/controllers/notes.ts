import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { Note } from '@emaric/gittodoro-ts/lib/interactor/entities/Note'

import { noteConverter } from './converter'
import { getUserDocRef } from './users'

const COLLECTION_NAME = 'notes'

const getUserNotesColRef = () => {
  return collection(getUserDocRef(), COLLECTION_NAME)
}

const getUserNoteDocRef = (id: string) => {
  return doc(getUserNotesColRef(), id)
}

export const setUserNote = async (id: string, note: Note) => {
  const noteDocRef = getUserNoteDocRef(id)
  const noteSnap = await getDoc(noteDocRef)
  const docFunc = noteSnap.exists() ? updateDoc : setDoc
  await docFunc(noteDocRef, noteConverter.toFirestore(note))
}

export const getUserNoteData = async (id: string) => {
  const noteSnap = await getDoc(getUserNoteDocRef(id))
  if (noteSnap.exists()) {
    return noteConverter.fromFirestore(noteSnap, {})
  }
  return undefined
}

export const deleteUserNote = async (id: string) => {
  const noteDocRef = getUserNoteDocRef(id)
  await deleteDoc(noteDocRef)
  const result = await getUserNoteData(id)
  if (result) {
    throw new Error(
      `Error on notes.deleteUserNote(...). Failed to delete Note with id: ${id}.`
    )
  }
}

export const retrieveUserNotesByRange = async (start: Date, end: Date) => {
  const q = query(
    getUserNotesColRef(),
    where('date', '>=', start),
    where('date', '<', end)
  )
  const q2 = query(
    getUserNotesColRef(),
    where('updatedAt', '>=', start),
    where('updatedAt', '<', end)
  )

  const notes: Note[] = []
  const result = await Promise.all([
    getDocs(q.withConverter(noteConverter)),
    getDocs(q2.withConverter(noteConverter)),
  ])
  result.forEach((snaps) => {
    snaps.docs.forEach((_doc) => {
      const note = _doc.data()
      if (!notes.find((_note) => _note.id == note.id)) {
        notes.push(note)
      }
    })
  })
  return notes
}
