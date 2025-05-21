import { CreateProductCliCommand } from './product-command'
import { CreateProjectCliCommand } from './project-command'

import { InitCommand } from '@/application/scenario/init'
import { CreateProductCommand } from '@/application/use-case/product'
import { CreateProjectCommand } from '@/application/use-case/project'

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
