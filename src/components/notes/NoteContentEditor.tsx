import { useCallback, useEffect, useState, useRef, ChangeEvent } from 'react'

import { Note } from '@/models/Note'

import styles from './Note.module.css'

import * as Button from './buttons'

interface Props {
  note: Note
  onChange: (note: Note) => void
}

export const NoteContentEditor = ({ note, onChange }: Props) => {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState(note.content)

  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const textAreaContent = event.target.value
    setContent(textAreaContent)
  }, [setContent])

  const triggerOnChange = useCallback(() => {
    onChange({
      ...note,
      content: content
    })
  }, [onChange, content, note])

  useEffect(() => {
    const timeout = setTimeout(() => {
      triggerOnChange()
    }, 500)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.value = note.content
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <textarea ref={contentRef} onChange={handleChange} name="content"></textarea>
  )
}