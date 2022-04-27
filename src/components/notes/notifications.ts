import { confirmDelete, notifySuccess } from '@/modules/notiflix'

export const notifyCopied = () => {
  notifySuccess('Copied!')
}

export const confirmDeleteNote = confirmDelete
