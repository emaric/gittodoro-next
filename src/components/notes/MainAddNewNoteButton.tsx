import { useCallback } from 'react'

import { useMainNotes } from '@/context/MainNotesContextProvider'

import styles from './Note.module.css'

import * as Button from './buttons'

const MainAddNewNoteButton = () => {
  const { allowAdd, createNote } = useMainNotes()

  const handleAddNote = useCallback(async () => {
    await Promise.resolve(createNote('', new Date()))
  }, [createNote])

  return (
    <>
      {allowAdd &&
        <div>
          <Button.Add onClick={handleAddNote} />
        </div>
      }
    </>
  )

}

export default MainAddNewNoteButton