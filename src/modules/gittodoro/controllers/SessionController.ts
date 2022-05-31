import {
  CreateWithDuration,
  DeleteByIDs,
  ReadByRange,
  StartSessionWithDurationRequest,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/request.model'
import { RequestBy } from '@emaric/gittodoro-ts/lib/interactor/external-users/common/io/request.model'

import { Duration } from '@/modules/gittodoro/models/Duration'
import { Session } from '@/modules/gittodoro/models/Session'
import SessionModelInterface from '@/modules/gittodoro/models/SessionModelInterface'

import SessionCommandProvider from '@/modules/gittodoro/controllers/SessionCommandProvider'
import { RequestWith } from '@emaric/gittodoro-ts/lib/interactor/common/io/request.model'

export interface SessionViewInterface {
  setStarted(session?: Session): void
  setStopped(session?: Session): void
  setCreated(sessions: Session[]): void
  setReadByRange(sessions: Session[]): void
  setFirst(session?: Session): void
  setDeleted(sessions: Session[]): void
}

export class SessionController {
  private model: SessionModelInterface
  private view?: SessionViewInterface
  private commandProvider: SessionCommandProvider

  constructor(model: SessionModelInterface, view?: SessionViewInterface) {
    this.view = view
    this.model = model
    this.commandProvider = new SessionCommandProvider(this.model)
  }

  async start(duration: Duration, start = new Date()) {
    const request: StartSessionWithDurationRequest = {
      with: RequestWith.duration,
      start,
      duration,
    }
    await this.commandProvider.startCommand.execute(request)
    this.view?.setStarted(this.model.started)
  }

  async stop(date = new Date()) {
    await this.commandProvider.stopCommand.execute({ date })
    this.view?.setStopped(this.model.stopped)
  }

  async createWithDuration(sessions: Session[]) {
    const request: CreateWithDuration = {
      with: RequestWith.duration,
      sessions,
    }
    await this.commandProvider.createCommand.execute(request)
    this.view?.setCreated(this.model.created)
  }

  async readByRange(startInclusive: Date, end: Date) {
    const request: ReadByRange = {
      by: RequestBy.range,
      startInclusive,
      end,
    }
    await this.commandProvider.readCommand.execute(request)
    this.view?.setReadByRange(this.model.read)
  }

  async readFirst() {
    await this.commandProvider.readFirstCommand.execute()
    this.view?.setFirst(this.model.first)
  }

  async deleteByIDs(ids: string[]) {
    const request: DeleteByIDs = {
      by: RequestBy.ids,
      ids,
    }
    await this.commandProvider.deleteCommand.execute(request)
    this.view?.setDeleted(this.model.deleted)
  }
}
