import {
  CreateNotesGatewayInterface,
  DeleteNotesGatewayInterface,
  ReadFirstNoteGatewayInterface,
  ReadNotesGatewayInterface,
  UpdateNotesGatewayInterface,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/notes/io/data.gateway'

export default interface NoteGatewayInterface
  extends CreateNotesGatewayInterface,
    ReadNotesGatewayInterface,
    ReadFirstNoteGatewayInterface,
    UpdateNotesGatewayInterface,
    DeleteNotesGatewayInterface {}
