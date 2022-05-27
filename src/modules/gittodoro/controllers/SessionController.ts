import { Duration } from '@/modules/gittodoro/models/Duration'
import { Session } from '@/modules/gittodoro/models/Session'
import SessionModelInterface from '@/modules/gittodoro/models/SessionModelInterface'

import SessionCommandProvider from '@/modules/gittodoro/controllers/SessionCommandProvider'
import {
  ReadByRange,
  RequestWith,
  StartSessionWithDurationRequest,
} from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/request.model'
import { RequestBy } from '@emaric/gittodoro-ts/lib/interactor/external-users/common/io/request.model'

export interface SessionViewInterface {
  setStarted(session?: Session): void
  setStopped(session?: Session): void
  setReadByRange(sessions: Session[]): void
  setFirst(session?: Session): void
}

export class SessionController {
  private view: SessionViewInterface
  private model: SessionModelInterface
  private commandProvider: SessionCommandProvider

  constructor(view: SessionViewInterface, model: SessionModelInterface) {
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
    this.view.setStarted(this.model.started)
  }

  async stop(date = new Date()) {
    await this.commandProvider.stopCommand.execute({ date })
    this.view.setStopped(this.model.stopped)
  }

  async readByRange(startInclusive: Date, end: Date) {
    const request: ReadByRange = {
      by: RequestBy.range,
      startInclusive,
      end,
    }
    await this.commandProvider.readCommand.execute(request)
    this.view.setReadByRange(this.model.read)
  }

  async readFirst() {
    await this.commandProvider.readFirstCommand.execute()
    this.view.setFirst(this.model.first)
  }
}
