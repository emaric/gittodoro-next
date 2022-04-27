import { Markdown } from '@/modules/markdown'

interface Props {
  children: string
  onChange: (content: string) => void
}

export const NoteContent = ({ children, onChange }: Props) => {
  return <Markdown onChange={onChange}>{children}</Markdown>
}