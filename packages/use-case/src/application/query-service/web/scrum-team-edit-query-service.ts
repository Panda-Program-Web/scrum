import { EmployeeRepositoryInterface, ScrumTeamRepositoryInterface } from '@panda-project/core'

import { Result } from './types'

import { EmployeeRepository, ScrumTeamRepository } from '@panda-project/gateway'

export type ScrumTeamEditQueryServiceDto = {
  scrumTeam: {
    id: number
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
  employees: {
    id: number
    fullName: string
  }[]
}

export class ScrumTeamEditQueryService {
  constructor(
    private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository(),
    private readonly employeeRepository: EmployeeRepositoryInterface = new EmployeeRepository()
  ) {}

  async exec(): Promise<Result<ScrumTeamEditQueryServiceDto>> {
    const allEmployees = await this.employeeRepository.findAll()
    const employees = allEmployees.map((employee) => ({
      id: employee.id.toInt(),
      fullName: employee.employeeName.getFullName(),
    }))

    try {
      const { id, scrumMaster, productOwner, developers } = await this.scrumTeamRepository.fetchOrFail()
      // presentation logic
      return {
        data: {
          scrumTeam: {
            id: id.toInt(),
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
          employees,
        },
        error: null,
      }
    } catch {
      return {
        data: { scrumTeam: null, employees },
        error: null,
      }
    }
  }
}
