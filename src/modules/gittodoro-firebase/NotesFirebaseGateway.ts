import Note from '@emaric/gittodoro-ts/lib/interactor/entities/Note'
import NoteGatewayInterface from '@/gittodoro/db/NoteGatewayInterface'

import {
  deleteUserNote,
  getUserNoteData,
  retrieveOldestNote,
  retrieveUserNotesByRange,
  setUserNote,
} from './controllers/notes'

import { createID } from './utils'

export class NoteFirebaseGateway implements NoteGatewayInterface {
  async create(
    notes: { content: string; date: Date; updatedAt?: Date | undefined }[]
  ): Promise<Note[]> {
    const notesWithIDs = notes.map((request) => {
      const { content, date, updatedAt } = request
      const id = createID(date)
      return new Note(id, date, content, updatedAt)
    })

    await Promise.all(
      notesWithIDs.map((note) => {
        return setUserNote(note.id, note)
      })
    )

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
    await Promise.all(
      origNotes.map((note) => {
        const request = notes.find((n) => n.id == note.id)
        if (request) {
          note.content = request.content
          note.updatedAt = request.updatedAt
        }
        return setUserNote(note.id, note)
      })
    )
    return await this.read(ids)
    // await setUserNote(String(note.id), note)
    // const result = await this.read(note.id)
    // if (result) return result
    // throw new Error(`Error on 'NotesFirebaseGateway.update(...).'`)
  }

  async delete(ids: string[]): Promise<Note[]> {
    const notes = await this.read(ids)
    await Promise.all(ids.map((id) => deleteUserNote(id)))
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
