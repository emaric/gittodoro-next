import DefaultDurationPresenterInterface from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/io/DefaultDurationPresenterInterface'
import { ReadDefaultDurationResponse } from '@emaric/gittodoro-ts/lib/interactor/external-users/default-duration/io/response.model'
import { DurationResponse } from '@emaric/gittodoro-ts/lib/interactor/external-users/session/io/response.model'
import DurationController, {
  DurationModelInterface,
  DurationViewInterface,
} from '../controllers/DurationController'
import DurationGatewayInterface from '../db/DurationGatewayInterface'
import { Duration } from '../models/Duration'

class DurationModel implements DurationModelInterface {
  dataGateway: DurationGatewayInterface
  presenter: DefaultDurationPresenterInterface
  duration?: Duration

  constructor(dataGateway: DurationGatewayInterface) {
    this.dataGateway = dataGateway
    this.presenter = {
      present: (response: ReadDefaultDurationResponse) => {
        this.duration = response.duration
        return Promise.resolve(response.duration)
      },
    }
  }
}

export default class DurationAPI {
  private controller: DurationController
  private model: DurationModel

  constructor(
    dataGateway: DurationGatewayInterface,
    view?: DurationViewInterface
  ) {
    this.model = new DurationModel(dataGateway)
    this.controller = new DurationController(this.model, view)
  }

  async readDefault() {
    await this.controller.readDefault()
    return this.model.duration
  }
}
