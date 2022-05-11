import { CloudUploadIcon, TrashCanAltIcon } from "@/modules/fontawesome"

export const Delete = ({ title = 'Delete' }) => {
  return (
    <button title={title}>
      <TrashCanAltIcon />
    </button>
  )
}

export const Upload = ({ title = 'Upload' }) => {
  return (
    <button title={title}>
      <CloudUploadIcon />
    </button>
  )
}
