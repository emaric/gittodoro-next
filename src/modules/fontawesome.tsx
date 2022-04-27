import { faPenToSquare, faCopy, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faAngleDown, faAngleUp, faMinus, faXmark, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '@fortawesome/fontawesome-svg-core/styles.css';

export const PenToSquareIcon = () => {
  return <FontAwesomeIcon icon={faPenToSquare} />
}

export const CopyIcon = () => {
  return <FontAwesomeIcon icon={faCopy} />
}

export const TrashCanIcon = () => {
  return <FontAwesomeIcon icon={faTrashCan} />
}

export const MinusIcon = () => {
  return <FontAwesomeIcon icon={faMinus} />
}

export const AngleDownIcon = () => {
  return <FontAwesomeIcon icon={faAngleDown} />
}

export const AngleUpIcon = () => {
  return <FontAwesomeIcon icon={faAngleUp} />
}

export const XMarkIcon = () => {
  return <FontAwesomeIcon icon={faXmark} />
}

export const AngleRightIcon = () => {
  return <FontAwesomeIcon icon={faAngleRight} />
}

export const AngleLeftIcon = () => {
  return <FontAwesomeIcon icon={faAngleLeft} />
}