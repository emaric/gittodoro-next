import { NoteController as ModuleNoteController } from '@/modules/gittodoro/controllers/NoteController'
import { NotesController as ModuleNotesController } from '@/modules/gittodoro/controllers/NotesController'
import { NoteView } from '@/modules/gittodoro/views/NoteView'

import { Note } from '@/models/Note'
import { NotesView } from '@/modules/gittodoro/views/NotesView'

enum Action {
  create,
  read,
  update,
  delete,
  readByRange,
}

export interface NotesViewInterface {
  updateCreateView: (note: Note) => void
  updateReadView: (note: Note) => void
  updateUpdateView: (note: Note) => void
  updateDeleteView: () => void
  updateReadByRangeView: (notes: Note[]) => void
}

export class NotesController {
  private noteController: ModuleNoteController
  private notesController: ModuleNotesController
  private action?: Action

  note?: Note
  notes?: Note[]

  constructor(view: NotesViewInterface) {
    this.noteController = new ModuleNoteController(
      new NoteView((note: Note) => {
        this.note = note
        if (this.action === Action.create) {
          view.updateCreateView(note)
        }
        if (this.action === Action.read) {
          view.updateReadView(note)
        }
        if (this.action === Action.update) {
          view.updateUpdateView(note)
        }
        if (this.action === Action.delete) {
          view.updateDeleteView()
        }
      })
    )

    this.notesController = new ModuleNotesController(
      new NotesView((notes: Note[]) => {
        this.notes = notes
        if (this.action === Action.readByRange) {
          view.updateReadByRangeView(notes)
        }
      })
    )
  }

  create(content: string, date = new Date()) {
    this.action = Action.create
    this.noteController.create(content, date)
  }

  read(id: number) {
    this.action = Action.read
    this.noteController.read(id)
  }

  update(id: number, content: string, updatedAt = new Date()) {
    this.action = Action.update
    this.noteController.update(id, content, updatedAt)
  }

  delete(id: number) {
    this.action = Action.delete
    this.noteController.delete(id)
  }

  readByRange(start: Date, end: Date) {
    this.action = Action.readByRange
    this.notesController.readByRange(start, end)
  }
}
