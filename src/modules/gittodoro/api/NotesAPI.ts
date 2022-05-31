import NoteController, {
  NoteViewInterface,
} from '../controllers/NoteController'
import NoteGatewayInterface from '../db/NoteGatewayInterface'
import GittodoroError from '../errors/GittodoroError'
import { Note } from '../models/Note'
import NoteModel from '../models/NoteModel'
import NoteModelInterface from '../models/NoteModelInterface'
import Logger from '../utils/Logger'

export class NoteLogger implements NoteViewInterface {
  private logger: Logger

  constructor(name: string) {
    this.logger = new Logger(name)
  }

  setNote(note?: Note): void {
    this.logger.log('Note:', JSON.stringify(note))
  }
  setNotes(notes: Note[]): void {
    this.logger.log('Notes:', notes.map((n) => JSON.stringify(n)).join('\n'))
  }
}

export class NotesAPI {
  private controller: NoteController
  private model: NoteModelInterface

  constructor(dataGateway: NoteGatewayInterface, view?: NoteViewInterface) {
    this.model = new NoteModel(dataGateway)
    this.controller = new NoteController(this.model, view)
  }

  async create(content: string, date: Date): Promise<{ note: Note }> {
    await this.controller.create({ content, date })
    if (this.model.note) {
      return { note: this.model.note }
    }
    throw new GittodoroError('Failed to create a new note.')
  }

  async update(
    id: string,
    content: string,
    updatedAt: Date
  ): Promise<{ note: Note }> {
    await this.controller.update({ id, content, updatedAt })
    if (this.model.note) return { note: this.model.note }
    throw new GittodoroError('Failed to update a note.')
  }

  async delete(id: string) {
    await this.controller.delete(id)
    return this.model.note
  }

  async readByRange(start: Date, end: Date): Promise<{ notes: Note[] }> {
    await this.controller.readByRange(start, end)
    return { notes: this.model.notes }
  }

  async readFirst(): Promise<{ note?: Note }> {
    const response = await this.readByRange(new Date('2022-01-01'), new Date())
    const notes = response.notes || []
    return { note: notes[0] }
  }
}
