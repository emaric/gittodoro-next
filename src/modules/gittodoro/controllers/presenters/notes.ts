import { NotePresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/NotePresenterInterface'
import { NoteResponse } from '@emaric/gittodoro-ts/lib/interactor/responses/NoteResponse'

import { Note } from '@/modules/gittodoro/models/Note'
import { mapNote, mapNotes } from './mappers'

export interface NoteViewInterface {
  updateView(note: Note): void
}

export interface NotesViewInterface {
  updateView(notes: Note[]): void
}

export class NotePresenter implements NotePresenterInterface {
  noteView: NoteViewInterface

  constructor(noteView: NoteViewInterface) {
    this.noteView = noteView
  }

  present(response: NoteResponse): void {
    this.noteView.updateView(mapNote(response))
  }
}

export class NotesPresenter implements NotePresenterInterface {
  notesView: NotesViewInterface

  constructor(notesView: NotesViewInterface) {
    this.notesView = notesView
  }

  present(response: NoteResponse): void {
    this.notesView.updateView(mapNotes(response))
  }
}
