import { CreateProductWebCommand } from './product-command'
import { CreateProjectWebCommand } from './project-command'

import { InitCommand } from '@/application/scenario/init'
import { CreateProductCommand } from '@/application/use-case/product'
import { CreateProjectCommand } from '@/application/use-case/project'

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
