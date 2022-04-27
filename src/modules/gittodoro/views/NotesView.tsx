import { NotesViewInterface } from "../controllers/presenters/notes";
import { Note } from "../models/Note";

export class NotesView implements NotesViewInterface {
  callback: CallableFunction

  constructor(callback: CallableFunction) {
    this.callback = callback
  }

  updateView(notes: Note[]): void {
    this.callback(notes)
  }
}