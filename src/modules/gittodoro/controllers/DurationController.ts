import DefaultDurationPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/io/DefaultDurationPresenterInterface'
import ReadDefaultDurationCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/ReadDefaultDurationCommand'
import ResetDefaultDurationCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/ResetDefaultDurationCommand'
import UpdateDefaultDurationCommand from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/UpdateDefaultDurationCommand'

import DurationGatewayInterface from '../db/DurationGatewayInterface'
import { Duration } from '../models/Duration'

export interface DurationModelInterface {
  dataGateway: DurationGatewayInterface
  presenter: DefaultDurationPresenterInterface

  duration?: Duration
}

export interface DurationViewInterface {
  setDefault(duration?: Duration): void
}

export default class DurationController {
  private model: DurationModelInterface
  private view?: DurationViewInterface

  private readCommand?: ReadDefaultDurationCommand
  private updateCommand?: UpdateDefaultDurationCommand
  private resetCommand?: ResetDefaultDurationCommand

  constructor(model: DurationModelInterface, view?: DurationViewInterface) {
    this.model = model
    this.view = view
  }

  async readDefault() {
    if (this.readCommand == undefined) {
      this.readCommand = new ReadDefaultDurationCommand(
        this.model.dataGateway,
        this.model.presenter
      )
    }
    try {
      await this.readCommand.execute()
      this.view?.setDefault(this.model.duration)
    } catch (error) {
      this.model.duration = undefined
      this.view?.setDefault(undefined)
    }
  }

  async updateDefault(
    pomodoro: number,
    short: number,
    long: number,
    interval: number
  ) {
    if (this.updateCommand == undefined) {
      this.updateCommand = new UpdateDefaultDurationCommand(
        this.model.dataGateway,
        this.model.presenter
      )
    }
    await this.updateCommand.execute({ pomodoro, short, long, interval })
    this.view?.setDefault(this.model.duration)
  }

  async resetDefault() {
    if (this.resetCommand == undefined) {
      this.resetCommand = new ResetDefaultDurationCommand(
        this.model.dataGateway,
        this.model.presenter
      )
    }
    await this.resetCommand.execute()
    this.view?.setDefault(this.model.duration)
  }
}
