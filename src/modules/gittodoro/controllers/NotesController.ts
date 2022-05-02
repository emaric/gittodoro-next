import { NoteController as MainNoteController } from '@emaric/gittodoro-ts/lib/controller/NoteController'
import {
  NoteRangeRequest,
  NoteRequest,
} from '@emaric/gittodoro-ts/lib/interactor/requests/NoteRequest'
import {
  createNoteCommand,
  deleteNoteCommand,
  readNoteByRangeCommand,
  readNoteCommand,
  updateNoteCommand,
} from '@emaric/gittodoro-ts/lib/interactor/use-cases/CRUDNoteCommandFactory'

import { NoteLocalStorageGateway } from '@/modules/gittodoro/db/local/NoteLocalStorageGateway'
import { Note } from '@/modules/gittodoro/models/Note'
import { NotesPresenter } from './presenters/notes'

const source = new NoteLocalStorageGateway()
const presenter = new NotesPresenter()
const controller = new MainNoteController()

const createInteractor = createNoteCommand(source, presenter)
const readInteractor = readNoteCommand(source, presenter)
const updateInteractor = updateNoteCommand(source, presenter)
const deleteInteractor = deleteNoteCommand(source, presenter)
const readByRangeInteractor = readNoteByRangeCommand(source, presenter)

const createPromise = <T>(cf: CallableFunction) => {
  return new Promise<T>((resolve) => {
    presenter.setCallback(resolve)
    cf()
  })
}

export const createNote = (content: string, date = new Date()) => {
  const request: NoteRequest = {
    timestamp: new Date(),
    message: 'Create a new note.',
    content,
    date,
  }

  return createPromise<{ note: Note }>(() =>
    controller.createNote(createInteractor, request)
  )
}

export const readNote = (id: number) => {
  const request: NoteRequest = {
    timestamp: new Date(),
    message: 'Get note by id.',
    id,
  }

  return createPromise<{ note: Note }>(() =>
    controller.readNote(readInteractor, request)
  )
}

export const updateNote = (
  id: number,
  content: string,
  updatedAt = new Date()
) => {
  const request: NoteRequest = {
    timestamp: new Date(),
    message: 'Update note by id.',
    id,
    content,
    updatedAt,
  }
  return createPromise<{ note: Note }>(() =>
    controller.updateNote(updateInteractor, request)
  )
}

export const deleteNote = (id: number) => {
  const request: NoteRequest = {
    timestamp: new Date(),
    message: 'Delete note by id.',
    id,
  }
  return createPromise(() => controller.deleteNote(deleteInteractor, request))
}

export const readNotesByRange = (start: Date, end: Date) => {
  const request: NoteRangeRequest = {
    timestamp: new Date(),
    message: 'Get notes by range.',
    start,
    end,
  }

  return createPromise<{ notes: Note[] }>(() =>
    controller.readNoteByRange(readByRangeInteractor, request)
  )
}
