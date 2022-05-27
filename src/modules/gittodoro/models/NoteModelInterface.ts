import NotesPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/io/NotesPresenterInterface'
import NoteGatewayInterface from '../db/NoteGatewayInterface'
import { Note } from './Note'

export default interface NoteModelInterface {
  dataGateway: NoteGatewayInterface
  notePresenter: NotesPresenterInterface
  notesPresenter: NotesPresenterInterface

  note?: Note

  notes: Note[]
}
