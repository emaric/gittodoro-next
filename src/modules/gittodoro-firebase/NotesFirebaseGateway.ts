import Note from '@emaric/gittodoro-ts/lib/interactor/entities/Note'
import NoteGatewayInterface from '@/gittodoro/db/NoteGatewayInterface'

import {
  deleteUserNote,
  getUserNoteData,
  getUserNoteDocRef,
  retrieveOldestNote,
  retrieveUserNotesByRange,
  setUserNote,
} from './controllers/notes'

import { createID } from './utils'
import { writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

export class NoteFirebaseGateway implements NoteGatewayInterface {
  async create(
    notes: { content: string; date: Date; updatedAt?: Date | undefined }[]
  ): Promise<Note[]> {
    const notesWithIDs = notes.map((request) => {
      const { content, date, updatedAt } = request
      const id = createID(date)
      return new Note(id, date, content, updatedAt)
    })

    const batch = writeBatch(db)

    notesWithIDs.forEach((note) => batch.set(getUserNoteDocRef(note.id), note))

    await batch.commit()

    return notesWithIDs
  }

  async read(ids: string[]): Promise<Note[]> {
    const result = await Promise.all(ids.map((id) => getUserNoteData(id)))
    const notes: Note[] = []
    result.forEach((note) => {
      if (note) {
        notes.push(note)
      }
    })
    return notes
  }

  readByIDs(ids: string[]): Promise<Note[]> {
    return this.read(ids)
  }

  async readByRange(start: Date, end: Date): Promise<Note[]> {
    return await retrieveUserNotesByRange(start, end)
  }

  async first(): Promise<Note | undefined> {
    return await retrieveOldestNote()
  }

  async update(
    notes: { id: string; content: string; updatedAt: Date }[]
  ): Promise<Note[]> {
    const ids = notes.map((n) => n.id)
    const origNotes = await this.read(ids)

    const batch = writeBatch(db)

    origNotes.forEach((note) => {
      const request = notes.find((n) => n.id == note.id)
      if (request) {
        note.content = request.content
        note.updatedAt = request.updatedAt
        batch.update(getUserNoteDocRef(note.id), {
          content: request.content,
          updatedAt: request.updatedAt,
        })
      }
    })

    await batch.commit()
    return await this.read(ids)
  }

  async delete(ids: string[]): Promise<Note[]> {
    const notes = await this.read(ids)

    const batch = writeBatch(db)

    ids.forEach((id) => batch.delete(getUserNoteDocRef(id)))

    await batch.commit()
    return notes
  }

  deleteByIDs(ids: string[]): Promise<Note[]> {
    return this.delete(ids)
  }

  async deleteByRange(startInclusive: Date, end: Date): Promise<Note[]> {
    const notes = await this.readByRange(startInclusive, end)
    return this.deleteByIDs(notes.map((n) => n.id))
  }
}
