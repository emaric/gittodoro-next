import { useCallback, useEffect, useState } from 'react'

import { Note } from '@/models/Note'
import { useMainNotes } from '@/context/gittodoro/MainNotesContextProvider'

import styles from './Note.module.css'

import { MainNote } from './MainNote'

const MainNotes = () => {
  const { mainNotes: notes, newNote, updateNote, deleteNote } = useMainNotes()
  const [openNote, setOpenNote] = useState<Note | undefined>(undefined)

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
        {notes?.length == 0 &&
          <label className={styles.notes_container_label}>No notes found on this date.</label>
        }
      </div>
    </>
  )
}

export default MainNotes