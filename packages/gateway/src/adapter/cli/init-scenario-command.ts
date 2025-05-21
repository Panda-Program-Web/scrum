import { CreateProductCliCommand } from './product-command'
import { CreateProjectCliCommand } from './project-command'

import { CreateProductCommand, CreateProjectCommand, InitCommand } from '@panda-project/core'

export class InitCliCommand implements InitCommand {
  constructor(
    private readonly productName: string,
    private readonly projectName: string
  ) {}

  getCreateProductCommand(): CreateProductCommand {
    return new CreateProductCliCommand(this.productName)
  }

  getCreateProjectCommand(): CreateProjectCommand {
    return new CreateProjectCliCommand(this.projectName)
  }
}
