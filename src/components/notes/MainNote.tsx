import { useCallback, useEffect, useState } from "react"

import { Copy } from "@/modules/copytoclipboard"
import { Note } from "@/models/Note"

import styles from './Note.module.css'

import * as Button from "./buttons"
import { NoteContent } from "./NoteContent"
import { NoteContentEditor } from "./NoteContentEditor"
import { confirmDeleteNote, notifyCopied } from "./notifications"

interface Props {
  note: Note
  editing: boolean
  onChange: (note: Note) => void
  onClickEdit?: (note: Note, editing: boolean) => void
  onClickDelete?: (note: Note) => void
}
export const MainNote = ({ note, editing, onChange, onClickEdit, onClickDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(editing)
  const [isVisible, setIsVisible] = useState(true)

  const handleEdit = useCallback(() => {
    onClickEdit && onClickEdit(note, !isEditing)
    setIsEditing(!isEditing)
  }, [isEditing, onClickEdit, note])

  const handleToggleVisibility = useCallback(() => {
    setIsVisible(!isVisible)
  }, [isVisible, setIsVisible])

  const handleDelete = useCallback(() => {
    confirmDeleteNote({
      onDelete: () => {
        onClickDelete && onClickDelete(note)
      }
    })
  }, [onClickDelete, note])

  const handleCopy = useCallback(() => {
    if (note) {
      Copy(note.content)
      notifyCopied()
    }
  }, [note])

  const handleMarkdownChanged = useCallback((content: string) => {
    onChange({ ...note, content })
  }, [note, onChange])

  useEffect(() => {
    if (isEditing) {
      setIsVisible(true)
    }
  }, [isEditing])

  useEffect(() => {
    setIsEditing(editing)
  }, [editing])

  return (
    <article className={styles.note_container}>
      <div className={styles.header}>
        {isVisible ?
          <Button.Hide onClick={handleToggleVisibility} />
          :
          <Button.Show onClick={handleToggleVisibility} />
        }

        <label>{note.date.toLocaleString()}</label>
        <div className={styles.buttons_container}>
          {isEditing ?
            <Button.Close onClick={handleEdit} />
            :
            <>
              <Button.Delete onClick={handleDelete} />
              <Button.Edit onClick={handleEdit} />
              <Button.Copy onClick={handleCopy} />
            </>
          }
        </div>
      </div>
      {isVisible &&
        <div className={styles.content}>
          {isEditing ?
            <NoteContentEditor note={note} onChange={onChange} />
            :
            <NoteContent onChange={handleMarkdownChanged}>{note.content}</NoteContent>
          }
        </div>
      }
      <div className={styles.footer}>
        <label>date last saved</label>
      </div>
    </article>
  )
}