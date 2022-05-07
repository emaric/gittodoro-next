import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react"

import * as DateTime from '@/modules/temporal/DateTime'
import { localNotesAPI } from "@/modules/gittodoro"

import { Note } from "@/models/Note"

import { useClock } from "../clock/ClockContextProvider"

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
  const { clock: mainClock } = useClock()
  const [newNote, setNewNote] = useState<Note | undefined>(undefined)
  const [mainNotes, setMainNotes] = useState<Note[]>([])
  const [allowAdd, setAllowAdd] = useState(true)

  const loadNotesFromStorage = useCallback(() => {
    if (mainClock) {
      localNotesAPI.readByRange(mainClock.startDate, mainClock.endDate).then(({ notes }) => {
        setMainNotes(notes)
      })
    }
  }, [mainClock])

  const createNote = useCallback((content: string, date = new Date()) => {
    localNotesAPI.create(content, date).then(({ note }) => {
      setNewNote(note)
      loadNotesFromStorage()
    })
  }, [loadNotesFromStorage])

  const updateNote = useCallback((note: Note) => {
    localNotesAPI.update(note.id, note.content, new Date()).then((_) => {
      setNewNote(undefined)
      loadNotesFromStorage()
    })
  }, [loadNotesFromStorage])

  const deleteNote = useCallback((id: number) => {
    localNotesAPI.delete(id).then((_) => {
      setNewNote(undefined)
      loadNotesFromStorage()
    })
  }, [loadNotesFromStorage])

  const readNotesByRange = useCallback(async (start: Date, end: Date) => {
    const result = await localNotesAPI.readByRange(start, end)
    const notes = result.notes
    return notes ? notes.map(note => new Note(note)) : []
  }, [])

  const readFirstNote = useCallback(async (): Promise<Note | undefined> => {
    const result = await localNotesAPI.readFirst()
    const note = result.note
    if (note) {
      return new Note(note)
    }
    return undefined
  }, [])

  useEffect(() => {
    loadNotesFromStorage()

    if (mainClock) {
      setAllowAdd(0 == DateTime.difference(mainClock?.start, DateTime.today()))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainClock])

  useEffect(() => {
    if (mainNotes.length == 0) {
      loadNotesFromStorage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadNotesFromStorage])

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