import { NoteController } from '@emaric/gittodoro-ts/lib/controller/NoteController'
import { NoteDataGatewayInterface } from '@emaric/gittodoro-ts/lib/interactor/data-gateways/NoteDataGatewayInterface'
import {
  NoteRangeRequest,
  NoteRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/NoteRequest'
import {
  readNoteByRangeCommand,
  createNoteCommand,
  updateNoteCommand,
  deleteNoteCommand,
} from '@emaric/gittodoro-ts/lib/interactor/use-cases/CRUDNoteCommandFactory'

import {
  NotesPresenter,
  NotesViewInterface,
} from '../controllers/presenters/notes'
import { Note } from '../models/Note'

export class NotesAPI {
  private controller: NoteController
  private view?: NotesViewInterface
  private db: NoteDataGatewayInterface

  constructor(db: NoteDataGatewayInterface, view?: NotesViewInterface) {
    this.db = db
    this.view = view
    this.controller = new NoteController()
  }

  private createPresenter(resolve: CallableFunction) {
    return new NotesPresenter({
      updateView: (value) => {
        this.view && this.view.updateView(value)
        resolve(value)
      },
    })
  }

  create(content: string, date: Date): Promise<{ note: Note }> {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Create a new Note',
      content,
      date,
    }
    return new Promise((resolve) => {
      const interactor = createNoteCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.createNote(interactor, request)
    })
  }

  update(
    id: number,
    content: string,
    updatedAt: Date
  ): Promise<{ note: Note }> {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Update Note',
      id,
      content,
      updatedAt,
    }
    return new Promise((resolve) => {
      const interactor = updateNoteCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.updateNote(interactor, request)
    })
  }

  delete(id: number) {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Delete Note',
      id,
    }
    return new Promise((resolve) => {
      const interactor = deleteNoteCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.deleteNote(interactor, request)
    })
  }

  readByRange(start: Date, end: Date): Promise<{ notes: Note[] }> {
    const request: NoteRangeRequest = {
      timestamp: new Date(),
      message: 'Read Notes by Range',
      start,
      end,
    }
    return new Promise((resolve) => {
      const interactor = readNoteByRangeCommand(
        this.db,
        this.createPresenter(resolve)
      )
      this.controller.readNoteByRange(interactor, request)
    })
  }

  async readFirst(): Promise<{ note?: Note }> {
    const response = await this.readByRange(new Date('2022-01-01'), new Date())
    const notes = response.notes || []
    return { note: notes[0] }
  }
}
