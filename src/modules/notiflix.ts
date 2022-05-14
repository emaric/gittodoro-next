import Notiflix from 'notiflix'

export const notifySuccess = (message: string) => {
  Notiflix.Notify.success(message)
}

export const confirmDelete = (props: { onDelete: CallableFunction }) => {
  Notiflix.Confirm.show(
    'Confirm Deletion',
    'Are you sure want to delete this?',
    'Delete',
    'Cancel',
    function okCb() {
      props.onDelete()
    },
    undefined,
    { backgroundColor: 'var(--background)', messageColor: 'var(--color)' }
  )
}

interface confirmActionProps {
  title: string
  message: string
  callback: () => void
  okLabel?: string
  cancelLabel?: string
}
export const confirmAction = ({
  title,
  message,
  callback,
  okLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: confirmActionProps) => {
  Notiflix.Confirm.show(
    title,
    message,
    okLabel,
    cancelLabel,
    callback,
    undefined,
    { backgroundColor: 'var(--background)', messageColor: 'var(--color)' }
  )
}

export const notifyLoginRequired = (
  message = 'You must be logged in to perform this action.'
) => {
  Notiflix.Notify.info(message)
}

export const showLoading = () => {
  Notiflix.Loading.standard('Uploading...')
}

export const removeLoading = () => {
  Notiflix.Loading.remove()
}
