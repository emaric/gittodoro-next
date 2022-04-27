import { useCallback, useEffect, useState } from 'react'

import { Note } from '@/models/Note'
import { useMainNotes } from '@/context/MainNotesContextProvider'

import styles from './Note.module.css'

import * as Button from './buttons'
import { MainNote } from './MainNote'

export const MainNotes = () => {
  const { mainNotes: notes, newNote, createNote, updateNote, deleteNote } = useMainNotes()
  const [openNote, setOpenNote] = useState<Note | undefined>(undefined)

  const handleAddNote = useCallback(async () => {
    await Promise.resolve(createNote('', new Date()))
  }, [createNote])

  const handleChange = useCallback((n: Note) => {
    updateNote(n)
  }, [updateNote])

  const handleClickEdit = useCallback((note: Note, editing: boolean) => {
    if (!editing && note.id == openNote?.id) {
      setOpenNote(undefined)
    } else {
      editing && setOpenNote(note)
    }
  }, [openNote])

  const handleClickDelete = useCallback((note: Note) => {
    deleteNote(note.id)
  }, [deleteNote])

  useEffect(() => {
    if (newNote) {
      console.log('MainNotes.newNote...', newNote)
      setOpenNote(newNote)
    }
  }, [newNote])

  return (
    <>
      <div className={styles.buttons_container}>
        <Button.Add onClick={handleAddNote} />
      </div>
      <div className={styles.container}>
        {notes?.map((note, i) =>
          <MainNote
            key={i}
            note={note}
            onChange={handleChange}
            onClickEdit={handleClickEdit}
            onClickDelete={handleClickDelete}
            editing={note.id == openNote?.id} />
        )}
      </div>
    </>
  )
}