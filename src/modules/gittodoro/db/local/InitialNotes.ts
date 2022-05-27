import { Note } from '@/models/Note'

export const InitialNotes: Note[] = []

InitialNotes.push(
  new Note({
    id: '-1',
    date: new Date(),
    content: `# How To Use This App

  1.  Use it as a [Pomodoro Timer](https://en.m.wikipedia.org/wiki/Pomodoro_Technique).
      1. Decide on a task to focus on.
      1. Click the timer above to start a session.
          - The **yellow** ring indicates the time of the day.
      1. **Red** timer means it is time to focus on the task at hand.
      1. **Green** timer means it is time to take a quick break. It is ideal to rest your eyes, drink some water, or do some stretches.
      1. **Blue** timer means it is time to take a longer break. You deserve it!
  1.  Use it as a notepad.
      1. Click the Plus Sign button above to Add a New Note, like this one.
          - The buttons on top of this Note are as follows (from top left) **Hide**, **Delete**, **Edit**, and **Copy**.`,
  })
)
