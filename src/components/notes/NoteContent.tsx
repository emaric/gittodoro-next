import { Markdown } from '@/modules/markdown'

import styles from './Markdown.module.css'

interface Props {
  children: string
  onChange: (content: string) => void
}

export const NoteContent = ({ children, onChange }: Props) => {
  return (
    <div className={styles.markdown}>
      <Markdown onChange={onChange}>{children}</Markdown>
    </div>
  )
}