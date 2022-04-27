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
    }
  )
}
