import { ScrumTeamRepositoryInterface } from '@panda-project/core'

import { Result } from './types'

import { ScrumTeamRepository } from '@panda-project/gateway'

export type ScrumTeamQueryServiceDto = {
  scrumTeam: {
    scrumMaster: {
      employeeId: number
      name: string
      isDeveloper: boolean
    }
    productOwner: {
      employeeId: number
      name: string
      isDeveloper: boolean
    }
    developers: {
      employeeId: number
      name: string
    }[]
  } | null
}

export class ScrumTeamQueryService {
  constructor(private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()) {}

  async exec(): Promise<Result<ScrumTeamQueryServiceDto>> {
    try {
      const { scrumMaster, productOwner, developers } = await this.scrumTeamRepository.fetchOrFail()
      // presentation logic
      return {
        data: {
          scrumTeam: {
            scrumMaster: {
              employeeId: scrumMaster.getEmployeeId().toInt(),
              name: scrumMaster.getFullName(),
              isDeveloper: scrumMaster.isDeveloper(),
            },
            productOwner: {
              employeeId: productOwner.getEmployeeId().toInt(),
              name: productOwner.getFullName(),
              isDeveloper: productOwner.isDeveloper(),
            },
            developers: developers.map((developer) => ({
              employeeId: developer.getEmployeeId().toInt(),
              name: developer.getFullName(),
            })),
          },
        },
        error: null,
      }
    } catch {
      return {
        data: { scrumTeam: null },
        error: null,
      }
    }
  }
}
