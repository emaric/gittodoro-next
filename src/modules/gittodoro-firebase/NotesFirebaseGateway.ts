import { NoteDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/NoteDataGatewayInterface'
import { Note } from '@emaric/gittodoro-ts/lib/interactor/entities/Note'

import {
  deleteUserNote,
  getUserNoteData,
  retrieveUserNotesByRange,
  setUserNote,
} from './controllers/notes'

import { createID } from './utils'

export class NoteFirebaseGateway implements NoteDataGatewayInterface {
  async create(note: Note): Promise<Note> {
    const id = createID(note.date)
    note.id = id
    await setUserNote(String(id), note)
    const result = await this.read(id)
    if (result) return result
    throw new Error(
      'Error on NotesFirebaseGateway.create(...). Error saving note.'
    )
  }

  async read(id: number): Promise<Note> {
    const result = await getUserNoteData(String(id))
    if (result) return result
    throw new Error(
      `Error on 'NotesFirebaseGateway.read(...)'. No notes found with id: ${id}.`
    )
  }

  async update(note: Note): Promise<Note> {
    await setUserNote(String(note.id), note)
    const result = await this.read(note.id)
    if (result) return result
    throw new Error(`Error on 'NotesFirebaseGateway.update(...).'`)
  }

  async delete(id: number): Promise<Note | undefined> {
    try {
      await deleteUserNote(String(id))
    } catch (error) {
      throw new Error(
        `Error on NoteFirebaseGateway.delete(...). Failed to delete Note with id: ${id}`
      )
    }
    return undefined
  }

  async readByRange(start: Date, end: Date): Promise<Note[]> {
    return await retrieveUserNotesByRange(start, end)
  }
}
