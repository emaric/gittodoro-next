import { NoteListResponse } from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/io/response.model'
import NotesPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/io/NotesPresenterInterface'
import GittodoroError from '../../../errors/GittodoroError'
import { Note } from './Note'
import NoteModelInterface from './NoteModelInterface'
import NoteGatewayInterface from '../db/NoteGatewayInterface'

export default class NoteModel implements NoteModelInterface {
  readonly dataGateway: NoteGatewayInterface
  readonly notePresenter: NotesPresenterInterface
  readonly notesPresenter: NotesPresenterInterface
  note?: Note | undefined
  notes: Note[]

  constructor(dataGateway: NoteGatewayInterface) {
    this.dataGateway = dataGateway
    this.notes = []

    this.notePresenter = {
      present: (response: NoteListResponse): Promise<Note> => {
        const [note] = response.notes
        if (note && note.id) {
          const { id, content, date, updatedAt } = note
          const _note = new Note({ id: String(id), date, content, updatedAt })
          this.note = _note
          return Promise.resolve(_note)
        }
        return Promise.reject(new GittodoroError('Failed to present note.'))
      },
    }

    this.notesPresenter = {
      present: (response: NoteListResponse): Promise<Note[]> => {
        const notes = Array.from(response.notes).map((note) => {
          if (note && note.id) {
            const { id, content, date, updatedAt } = note
            return new Note({ id: String(id), date, content, updatedAt })
          }
          throw new GittodoroError(
            'Failed to present notes. ' + JSON.stringify(note)
          )
        })
        this.notes = notes
        return Promise.resolve(notes)
      },
    }
  }
}
