import { ProductUseCase } from '@/application/use-case/product'
import { ProjectUseCase } from '@/application/use-case/project'
import { CreateProductCommand, CreateProjectCommand } from '@panda-project/core'

export interface InitCommand {
  getCreateProductCommand(): CreateProductCommand
  getCreateProjectCommand(): CreateProjectCommand
}

export class InitScenario {
  constructor(
    private readonly productUseCase: ProductUseCase = new ProductUseCase(),
    private readonly projectUseCase: ProjectUseCase = new ProjectUseCase()
  ) {}

  async exec(command: InitCommand) {
    // 1つしかないはずなので、存在しない場合はエラーにする
    // 本格的にやるなら（product の id を取得するなら）、ログインする機能が必要
    const existsProduct = await this.productUseCase.exists()
    if (existsProduct) {
      throw new Error('プロダクトは作成済みです')
    }

    await this.productUseCase.create(command.getCreateProductCommand())
    await this.projectUseCase.create(command.getCreateProjectCommand())
  }
}
