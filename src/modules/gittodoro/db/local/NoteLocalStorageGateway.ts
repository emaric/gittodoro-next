import { NoteDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/NoteDataGatewayInterface'
import { Note } from '@emaric/gittodoro-ts/lib/interactor/entities/Note'

const mapToEntity = (notesString: string): Note[] => {
  const objs = JSON.parse(notesString)
  return objs.map((obj: any) => {
    const note: Note = {
      id: obj.id,
      date: new Date(obj.date),
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt) : new Date(obj.date),
      content: obj.content,
    }
    return note
  })
}

const mapToString = (notes: Note[]) => {
  return JSON.stringify(notes)
}

export class NoteLocalStorageGateway implements NoteDataGatewayInterface {
  static NOTES_ID = 'gittodoro-notes'
  static NOTES_LAST_ID = 'gittodoro-notes-id'

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

  get notes(): Note[] {
    const notes = localStorage.getItem(NoteLocalStorageGateway.NOTES_ID)
    if (notes) {
      return mapToEntity(notes)
    }
    return []
  }

  create(note: Note) {
    const id = this.lastID + 1
    const newNote: Note = {
      ...note,
      id,
    }
    this.updateNotes(this.notes.concat(newNote))
    this.updateLastID(id)
    return this.read(id)
  }

  read(id: number) {
    const found = this.notes.find((note) => {
      return note.id == id
    })
    if (found) {
      return Promise.resolve(found)
    } else {
      throw new Error('Note not found. ID: ' + id)
    }
  }

  update(note: Note) {
    this.updateNotes(
      this.notes.map((savedNote) => {
        if (savedNote.id == note.id) {
          return {
            ...note,
          }
        } else {
          return savedNote
        }
      })
    )

    return this.read(note.id)
  }

  delete(id: number) {
    this.updateNotes(this.notes.filter((note) => note.id != id))
    return Promise.resolve(undefined)
  }

  readByRange(start: Date, end: Date) {
    const notesInRange = this.notes.filter(
      (note) =>
        note.date.getTime() >= start.getTime() &&
        note.date.getTime() < end.getTime()
    )
    return Promise.resolve(notesInRange)
  }
}
