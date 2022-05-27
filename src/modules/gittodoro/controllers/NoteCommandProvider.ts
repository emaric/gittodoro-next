import CreateNotesCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/CreateNotesCommand'
import DeleteNotesCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/DeleteNotesCommand'
import ReadFirstNoteCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/ReadFirstNoteCommand'
import ReadNotesCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/ReadNotesCommand'
import UpdateNotesCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/UpdateNotesCommand'
import NoteModelInterface from '../models/NoteModelInterface'

export default class NoteCommandProvider {
  private model: NoteModelInterface

  private _createCommand?: CreateNotesCommand
  private _readCommand?: ReadNotesCommand
  private _readFirstCommand?: ReadFirstNoteCommand
  private _updateCommand?: UpdateNotesCommand
  private _deleteCommand?: DeleteNotesCommand

  constructor(model: NoteModelInterface) {
    this.model = model
  }

  get createCommand() {
    if (this._createCommand == undefined) {
      this._createCommand = new CreateNotesCommand(
        this.model.dataGateway,
        this.model.notesPresenter
      )
    }
    return this._createCommand
  }

  get readCommand() {
    if (this._readCommand == undefined) {
      this._readCommand = new ReadNotesCommand(
        this.model.dataGateway,
        this.model.notesPresenter
      )
    }
    return this._readCommand
  }

  get readFirstCommand() {
    if (this._readFirstCommand == undefined) {
      this._readFirstCommand = new ReadFirstNoteCommand(
        this.model.dataGateway,
        this.model.notePresenter
      )
    }
    return this._readFirstCommand
  }

  get updateCommand() {
    if (this._updateCommand == undefined) {
      this._updateCommand = new UpdateNotesCommand(
        this.model.dataGateway,
        this.model.notesPresenter
      )
    }
    return this._updateCommand
  }

  get deleteCommand() {
    if (this._deleteCommand == undefined) {
      this._deleteCommand = new DeleteNotesCommand(
        this.model.dataGateway,
        this.model.notesPresenter
      )
    }
    return this._deleteCommand
  }
}
