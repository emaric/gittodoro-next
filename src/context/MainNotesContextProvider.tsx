import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react"

import * as DateTime from '@/modules/temporal/DateTime'
import * as Controller from '@/modules/gittodoro/controllers/NotesController'

import { Note } from "@/models/Note"

import { useMainClock } from "./MainClockContextProvider"


type MainNotesContextType = {
  mainNotes?: Note[],
  createNote: (content: string, date?: Date) => void,
  updateNote: (note: Note) => void,
  deleteNote: (id: number) => void,
  mainNote?: Note,
  newNote?: Note,
  allowAdd: boolean
}

const MainNotesContext = createContext<MainNotesContextType | undefined>(undefined)

export const MainNotesProvider = (props: { children: ReactNode }) => {
  const { mainClock } = useMainClock()
  const [newNote, setNewNote] = useState<Note | undefined>(undefined)
  const [mainNotes, setMainNotes] = useState<Note[]>([])
  const [allowAdd, setAllowAdd] = useState(true)

  const loadNotesFromStorage = useCallback(() => {
    if (mainClock) {
      Controller.readNotesByRange(mainClock.startDate, mainClock.endDate).then(({ notes }) => {
        setMainNotes(notes)
      })
    }
  }, [mainClock])

  const createNote = useCallback((content: string, date = new Date()) => {
    Controller.createNote(content, date).then(({ note }) => {
      setNewNote(note)
      loadNotesFromStorage()
    })
  }, [loadNotesFromStorage])

  const updateNote = useCallback((note: Note) => {
    Controller.updateNote(note.id, note.content, new Date()).then((_) => {
      setNewNote(undefined)
      loadNotesFromStorage()
    })
  }, [loadNotesFromStorage])

  const deleteNote = useCallback((id: number) => {
    Controller.deleteNote(id).then((_) => {
      setNewNote(undefined)
      loadNotesFromStorage()
    })
  }, [loadNotesFromStorage])

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
    <MainNotesContext.Provider value={{ mainNotes, newNote, allowAdd, createNote, updateNote, deleteNote }}>
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