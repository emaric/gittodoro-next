import { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  children: string,
  onChange?: (text: string) => void
}

export const Markdown = ({ children, onChange }: Props) => {
  const toggleCheckbox = useCallback((start: number, end: number, checked: boolean) => {
    const cb = (v: boolean) => v ? '[x]' : '[ ]'
    const updatedCheckbox = children.substring(start, end).replace(cb(checked), cb(!checked))
    const updatedSource = children.substring(0, start) + updatedCheckbox + children.substring(end)
    onChange && onChange(updatedSource)
  }, [children, onChange])

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}
      components={{
        li: ({ node, children, ...props }) => {
          const liProps = { ...props, ordered: String(props.ordered) || undefined }
          if (props.className == 'task-list-item') {
            return (
              <li {...liProps}>
                <input type='checkbox' onChange={(e) => {
                  const start = node.position?.start.offset
                  const end = node.position?.end.offset
                  if (start && end) {
                    toggleCheckbox(start, end, props.checked || false)
                  }
                }} defaultChecked={props.checked || false} />
                {children.slice(1)}
              </li>
            )
          }
          return <li {...liProps}>{children}</li>
        }
      }}
    >{children}</ReactMarkdown >
  )
}