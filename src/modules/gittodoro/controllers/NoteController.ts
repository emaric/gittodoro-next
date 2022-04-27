import { NoteController as MainNoteController } from '@emaric/gittodoro-ts/lib/controller/NoteController'
import { NoteCommandInterface } from '@emaric/gittodoro-ts/lib/interactor/requests/NoteCommandInterface'
import { NoteRequest } from '@emaric/gittodoro-ts/lib/interactor/requests/NoteRequest'
import { NotePresenterInterface } from '@emaric/gittodoro-ts/lib/interactor/responses/NotePresenterInterface'
import {
  createNoteCommand,
  readNoteCommand,
  updateNoteCommand,
  deleteNoteCommand,
} from '@emaric/gittodoro-ts/lib/interactor/use-cases/CRUDNoteCommandFactory'

import { NoteLocalStorageGateway } from '../db/local/NoteLocalStorageGateway'
import { NotePresenter, NoteViewInterface } from './presenters/notes'

export class NoteController {
  private storage: NoteLocalStorageGateway
  private presenter: NotePresenterInterface
  private mainController: MainNoteController

  private createCommand: NoteCommandInterface
  private readCommand: NoteCommandInterface
  private updateCommand: NoteCommandInterface
  private deleteCommand: NoteCommandInterface

  constructor(noteView: NoteViewInterface) {
    this.storage = new NoteLocalStorageGateway()
    this.presenter = new NotePresenter(noteView)
    this.mainController = new MainNoteController()

    this.createCommand = createNoteCommand(this.storage, this.presenter)
    this.readCommand = readNoteCommand(this.storage, this.presenter)
    this.updateCommand = updateNoteCommand(this.storage, this.presenter)
    this.deleteCommand = deleteNoteCommand(this.storage, this.presenter)
  }

  create(content: string, date = new Date()) {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Create a new note.',
      content,
      date,
    }
    this.mainController.createNote(this.createCommand, request)
  }

  read(id: number) {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Get note by id.',
      id,
    }
    this.mainController.readNote(this.readCommand, request)
  }

  update(id: number, content: string, updatedAt = new Date()) {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Update note by id.',
      id,
      content,
    }
    this.mainController.updateNote(this.updateCommand, request)
  }

  delete(id: number) {
    const request: NoteRequest = {
      timestamp: new Date(),
      message: 'Delete note by id.',
      id,
    }
    this.mainController.deleteNote(this.deleteCommand, request)
  }
}
