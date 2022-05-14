import { useCallback } from "react"

import { CloudUploadIcon, TrashCanAltIcon } from "@/modules/fontawesome"
import { confirmDelete } from '@/modules/notiflix'

interface Props {
  title?: string,
  onClick?: () => void
}

export const Delete = ({ title = 'Delete', onClick }: Props) => {
  const handleClick = useCallback(() => {
    onClick && confirmDelete({ onDelete: onClick })
  }, [onClick])
  return (
    <button title={title} onClick={handleClick}>
      <TrashCanAltIcon />
    </button >
  )
}

export const Upload = ({ title = 'Upload', onClick }: Props) => {
  return (
    <button title={title} onClick={onClick}>
      <CloudUploadIcon />
    </button>
  )
}
