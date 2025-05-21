import { CreateProductWebCommand } from './product-command'
import { CreateProjectWebCommand } from './project-command'

import { CreateProductCommand, CreateProjectCommand } from '@panda-project/core'
import { InitCommand } from '@panda-project/use-case'

export class InitWebCommand implements InitCommand {
  constructor(
    private readonly productName: string,
    private readonly projectName: string
  ) {}

  getCreateProductCommand(): CreateProductCommand {
    return new CreateProductWebCommand(this.productName)
  }

  getCreateProjectCommand(): CreateProjectCommand {
    return new CreateProjectWebCommand(this.projectName)
  }
}
