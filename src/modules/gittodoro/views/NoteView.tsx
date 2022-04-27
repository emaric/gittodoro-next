import { NoteViewInterface } from "../controllers/presenters/notes";
import { Note } from "../models/Note";

export class NoteView implements NoteViewInterface {
  callback: CallableFunction

  constructor(callback: CallableFunction) {
    this.callback = callback
  }

  updateView(note: Note): void {
    this.callback(note)
  }
}