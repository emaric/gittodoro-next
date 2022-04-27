import { NoteController as MainNoteController } from '@emaric/gittodoro-ts/lib/controller/NoteController'
import { NoteCommandInterface } from '@emaric/gittodoro-ts/lib/interactor/requests/NoteCommandInterface'
import { NoteRangeRequest } from '@emaric/gittodoro-ts/lib/interactor/requests/NoteRequest'
import { readNoteByRangeCommand } from '@emaric/gittodoro-ts/lib/interactor/use-cases/CRUDNoteCommandFactory'

import { NoteLocalStorageGateway } from '../db/local/NoteLocalStorageGateway'
import { NotesPresenter, NotesViewInterface } from './presenters/notes'

export class NotesController {
  private storage: NoteLocalStorageGateway
  private presenter: NotesPresenter
  private mainController: MainNoteController

  private readByRangeCommand: NoteCommandInterface

  constructor(notesView: NotesViewInterface) {
    this.storage = new NoteLocalStorageGateway()
    this.presenter = new NotesPresenter(notesView)
    this.mainController = new MainNoteController()

    this.readByRangeCommand = readNoteByRangeCommand(
      this.storage,
      this.presenter
    )
  }

  readByRange(start: Date, end: Date) {
    const request: NoteRangeRequest = {
      timestamp: new Date(),
      message: 'Get notes by range.',
      start,
      end,
    }
    this.mainController.readNoteByRange(this.readByRangeCommand, request)
  }
}
