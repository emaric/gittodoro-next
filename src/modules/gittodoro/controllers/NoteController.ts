import { Note } from '../models/Note'
import NoteModelInterface from '../models/NoteModelInterface'
import NoteCommandProvider from './NoteCommandProvider'
import {
  DeleteByIDs,
  ReadByRange,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/io/request.model'
import { RequestBy } from '@emaric/gittodoro-ts/lib/interactor/external-users/common/io/request.model'

export interface NoteViewInterface {
  setNote(note?: Note): void

  setNotes(notes: Note[]): void
}

export default class NoteController {
  private model: NoteModelInterface
  private view?: NoteViewInterface
  private commandProvider: NoteCommandProvider

  constructor(model: NoteModelInterface, view?: NoteViewInterface) {
    this.view = view
    this.model = model
    this.commandProvider = new NoteCommandProvider(this.model)
  }

  async createAll(
    notes: {
      content: string
      date: Date
      updatedAt?: Date
      id?: string
    }[]
  ) {
    await this.commandProvider.createCommand.execute({ notes })
    this.view?.setNotes(this.model.notes)
  }

  async create(note: {
    content: string
    date: Date
    updatedAt?: Date
    id?: string
  }) {
    await this.commandProvider.createCommand.execute({
      notes: [note],
    })
    const newNote = this.model.notes[0]
    this.model.note = newNote
    this.view?.setNote(this.model.note)
  }

  async readByRange(startInclusive: Date, end: Date) {
    const request: ReadByRange = {
      by: RequestBy.range,
      startInclusive,
      end,
    }
    await this.commandProvider.readCommand.execute(request)
    this.view?.setNotes(this.model.notes)
  }

  async update(note: { id: string; content: string; updatedAt: Date }) {
    await this.commandProvider.updateCommand.execute({ notes: [note] })
    this.model.note = this.model.notes[0]
    this.view?.setNote(this.model.note)
  }

  async delete(id: string) {
    const request: DeleteByIDs = {
      by: RequestBy.ids,
      ids: [id],
    }
    await this.commandProvider.deleteCommand.execute(request)
    this.model.note = this.model.notes[0]
    this.view?.setNote(this.model.note)
  }

  async deleteAll(ids: string[]) {
    const request: DeleteByIDs = {
      by: RequestBy.ids,
      ids,
    }
    await this.commandProvider.deleteCommand.execute(request)
    this.view?.setNotes(this.model.notes)
  }
}
