import {
  CreateNotesGatewayInterface,
  ReadNotesGatewayInterface,
  ReadFirstNoteGatewayInterface,
  DeleteNotesGatewayInterface,
  UpdateNotesGatewayInterface,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/io/data.gateway'
import Note from '@emaric/gittodoro-ts/lib/interactor/entities/Note'
import { InitialNotes } from './InitialNotes'

const mapToEntity = (notesString: string): Note[] => {
  const objs = JSON.parse(notesString)
  return objs.map((obj: any) => {
    const note: Note = {
      id: String(obj.id),
      date: new Date(obj.date),
      updatedAt: obj.updatedAt && new Date(obj.updatedAt),
      content: obj.content,
    }
    return note
  })
}

const mapToString = (notes: Note[]) => {
  return JSON.stringify(notes)
}

export class NoteLocalStorageGateway
  implements
    CreateNotesGatewayInterface,
    ReadFirstNoteGatewayInterface,
    ReadNotesGatewayInterface,
    DeleteNotesGatewayInterface,
    UpdateNotesGatewayInterface
{
  static NOTES_ID = 'gittodoro-notes'
  static NOTES_LAST_ID = 'gittodoro-notes-id'

  constructor() {
    if (this.lastID <= -1) {
      this.create(InitialNotes)
    }
  }

  get notes(): Note[] {
    const notes = localStorage.getItem(NoteLocalStorageGateway.NOTES_ID)
    if (notes) {
      return mapToEntity(notes)
    }
    return []
  }

  private get lastID() {
    const lastIDString = localStorage.getItem(
      NoteLocalStorageGateway.NOTES_LAST_ID
    )
    if (lastIDString) {
      return Number(lastIDString)
    } else {
      return -1
    }
  }

  private updateLastID(id: number) {
    localStorage.setItem(NoteLocalStorageGateway.NOTES_LAST_ID, String(id))
  }

  private updateNotes(notes: Note[]) {
    localStorage.setItem(NoteLocalStorageGateway.NOTES_ID, mapToString(notes))
  }

  create(
    notes: { content: string; date: Date; updatedAt?: Date | undefined }[]
  ): Promise<Note[]> {
    const newNotes = notes.map((note, i) => {
      const id = String(this.lastID + i + 1)
      return new Note(id, note.date, note.content)
    })

    this.updateNotes([...this.notes, ...newNotes])
    const lastID = newNotes[newNotes.length - 1].id
    this.updateLastID(Number(lastID))
    return Promise.resolve(newNotes)
  }

  readByIDs(ids: string[]): Promise<Note[]> {
    const notes = this.notes.filter((n) => ids.includes(n.id))
    return Promise.resolve(notes)
  }

  readByRange(start: Date, end: Date) {
    const notesInRange = this.notes.filter(
      (note) =>
        note.date.getTime() >= start.getTime() &&
        note.date.getTime() < end.getTime()
    )
    return Promise.resolve(notesInRange)
  }

  update(
    notes: { id: string; content: string; updatedAt: Date }[]
  ): Promise<Note[]> {
    const ids = notes.map((n) => n.id)
    const notesToUpdate = this.notes.filter((n) => ids.includes(n.id))
    const updated = notesToUpdate.map((note) => {
      const newValues = notes.find((n) => n.id == note.id)
      note.content = newValues?.content || note.content
      note.updatedAt = newValues?.updatedAt
      return note
    })

    this.updateNotes(
      this.notes.map((note) => {
        const updatedNote = updated.find((n) => n.id == note.id)
        if (updatedNote) {
          return updatedNote
        }
        return note
      })
    )

    return Promise.resolve(updated)
  }

  async deleteByIDs(ids: string[]): Promise<Note[]> {
    const toDelete = await this.readByIDs(ids)
    this.updateNotes(this.notes.filter((n) => !ids.includes(n.id)))
    return Promise.resolve(toDelete)
  }

  async deleteByRange(startInclusive: Date, end: Date): Promise<Note[]> {
    const toDelete = await this.readByRange(startInclusive, end)
    const ids = toDelete.map((n) => n.id)
    this.updateNotes(this.notes.filter((n) => !ids.includes(n.id)))
    return Promise.resolve(toDelete)
  }

  first(): Promise<Note | undefined> {
    const first = this.notes.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )[0]
    return Promise.resolve(first)
  }
}
