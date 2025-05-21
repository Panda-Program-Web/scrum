import {
  Product,
  ProductRepositoryInterface,
  Project,
  ProjectRepositoryInterface,
  ScrumTeam,
  ScrumTeamRepositoryInterface,
} from '@panda-project/core'

import { DefaultError, ErrorReason, Result } from './types'

import { ProductRepository, ProjectRepository, ScrumTeamRepository } from '@panda-project/gateway'

export type ProjectListQueryServiceDto = {
  product?: {
    id: NonNullable<Product['id']['value']>
    name: Product['name']['value']
  }
  project?: {
    id: NonNullable<Project['id']['value']>
    name: Project['name']['value']
  }
  scrumTeam?: {
    poName: ReturnType<ScrumTeam['productOwner']['getFullName']>
    smName: ReturnType<ScrumTeam['scrumMaster']['getFullName']>
    developersCount: number
  } | null
}

interface CustomError extends DefaultError {
  reason: typeof ErrorReason.ProductNotExists
}

export class ProjectListQueryService {
  constructor(
    private readonly productRepository: ProductRepositoryInterface = new ProductRepository(),
    private readonly projectRepository: ProjectRepositoryInterface = new ProjectRepository(),
    private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()
  ) {}

  async exec(): Promise<Result<ProjectListQueryServiceDto, CustomError>> {
    // business logic
    const product = await this.productRepository.fetch()
    if (product === null) {
      return {
        data: null,
        error: {
          reason: ErrorReason.ProductNotExists,
        },
      }
    }

    // product と project は同時に作るのでここを通ることはない
    const project = (await this.projectRepository.fetch())!

    try {
      const scrumTeam = await this.scrumTeamRepository.fetchOrFail()

      // presentation logic
      return {
        data: {
          product: {
            id: product.id.toInt(),
            name: product.name.value,
          },
          project: {
            id: project.id.toInt(),
            name: project.name.value,
          },
          scrumTeam: {
            poName: scrumTeam.productOwner.getFullName(),
            smName: scrumTeam.scrumMaster.getFullName(),
            developersCount: scrumTeam.developers.length,
          },
        },
        error: null,
      }
    } catch (e) {
      return {
        data: {
          product: {
            id: product.id.toInt(),
            name: product.name.value,
          },
          project: {
            id: project.id.toInt(),
            name: project.name.value,
          },
          scrumTeam: null,
        },
        error: null,
      }
    }
  }
}
