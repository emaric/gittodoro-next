import { createContext, useMemo, ReactNode, useContext, useEffect, useState, useCallback } from "react"

import { Note } from "@/models/Note"
import { NotesController as NotesAppController, NotesViewInterface } from '@/controllers/NotesController'

import * as DateTime from '@/modules/temporal/DateTime'

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

  const view = useMemo(() => {
    class View implements NotesViewInterface {
      updateCreateView(note: Note) {
        setNewNote(note)
      }

      updateReadView(note: Note) {
        setNewNote(note)
      }
      updateUpdateView(note: Note) {
        setNewNote(note)
      }
      updateDeleteView() {
        setNewNote(undefined)
      }
      updateReadByRangeView(notes: Note[]) {
        setMainNotes(notes)
      }
    }
    return new View()
  }, [])
  const controller = useMemo(() => {
    return new NotesAppController(view)
  }, [view])

  const loadNotesFromStorage = useCallback(() => {
    if (mainClock && controller) {
      controller.readByRange(mainClock.startDate, mainClock.endDate)
    }
  }, [mainClock, controller])

  const createNote = useCallback((content: string, date = new Date()) => {
    if (controller) {
      controller.create(content, date)
      loadNotesFromStorage()
    }
  }, [loadNotesFromStorage, controller])

  const updateNote = useCallback(async (note: Note) => {
    if (controller) {
      await Promise.resolve(controller.update(note.id, note.content, new Date()))
      loadNotesFromStorage()
    } else {
      throw new Error('noteController is undefined...')
    }
  }, [loadNotesFromStorage, controller])

  const deleteNote = useCallback(async (id: number) => {
    if (controller) {
      await Promise.resolve(controller.delete(id))
      loadNotesFromStorage()
    } else {
      throw new Error('noteController is undefined...')
    }
  }, [loadNotesFromStorage, controller])

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