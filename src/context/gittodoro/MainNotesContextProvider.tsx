import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react"

import * as DateTime from '@/modules/temporal/DateTime'

import { Note } from "@/models/Note"

import { useClock } from "@/context/clock/ClockContextProvider"
import { useGittorodoAPI } from "@/context/gittodoro-firebase/GittodoroAPIContextProvider"

type MainNotesContextType = {
  mainNotes?: Note[],
  createNote: (content: string, date?: Date) => void,
  updateNote: (note: Note) => void,
  deleteNote: (id: number) => void,
  readNotesByRange: (start: Date, end: Date) => Promise<Note[]>,
  readFirstNote: () => Promise<Note | undefined>
  mainNote?: Note,
  newNote?: Note,
  allowAdd: boolean,
}

const MainNotesContext = createContext<MainNotesContextType | undefined>(undefined)

export const MainNotesProvider = (props: { children: ReactNode }) => {
  const { notesAPI } = useGittorodoAPI()
  const { clock: mainClock } = useClock()
  const [newNote, setNewNote] = useState<Note | undefined>(undefined)
  const [mainNotes, setMainNotes] = useState<Note[]>([])
  const [allowAdd, setAllowAdd] = useState(true)

  const loadNotes = useCallback(() => {
    if (mainClock && notesAPI) {
      notesAPI.readByRange(mainClock.startDate, mainClock.endDate).then(({ notes }) => {
        setMainNotes(notes)
      })
    }
  }, [mainClock, notesAPI])

  const createNote = useCallback((content: string, date = new Date()) => {
    notesAPI && notesAPI.create(content, date).then(({ note }) => {
      setNewNote(note)
      loadNotes()
    })
  }, [loadNotes, notesAPI])

  const updateNote = useCallback((note: Note) => {
    notesAPI && notesAPI.update(note.id, note.content, new Date()).then((_) => {
      setNewNote(undefined)
      loadNotes()
    })
  }, [loadNotes, notesAPI])

  const deleteNote = useCallback((id: number) => {
    notesAPI && notesAPI.delete(id).then((_) => {
      setNewNote(undefined)
      loadNotes()
    })
  }, [loadNotes, notesAPI])

  const readNotesByRange = useCallback(async (start: Date, end: Date) => {
    if (notesAPI) {
      const result = await notesAPI.readByRange(start, end)
      const notes = result.notes
      return notes ? notes.map(note => new Note(note)) : []
    }
    return []
  }, [notesAPI])

  const readFirstNote = useCallback(async (): Promise<Note | undefined> => {
    if (notesAPI) {
      const result = await notesAPI.readFirst()
      const note = result.note
      if (note) {
        return new Note(note)
      }
    }
    return undefined
  }, [notesAPI])

  useEffect(() => {
    loadNotes()

    if (mainClock) {
      setAllowAdd(0 == DateTime.difference(mainClock?.start, DateTime.today()))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainClock])

  useEffect(() => {
    if (mainNotes.length == 0) {
      loadNotes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadNotes])

  return (
    <MainNotesContext.Provider value={{
      mainNotes,
      newNote,
      allowAdd,
      createNote,
      updateNote,
      deleteNote,
      readNotesByRange,
      readFirstNote
    }}>
      {props.children}
    </MainNotesContext.Provider>
  )
}

export const useMainNotes = () => {
  const context = useContext(MainNotesContext)

  if (!context) {
    throw new Error('useMainNotes must be used inside a `MainNotesProvider`')
  }

  return context
}