import { EmployeeRepositoryInterface, ScrumTeamRepositoryInterface } from '@panda-project/core'

import { EmployeeRepository, ScrumTeamRepository } from '@panda-project/gateway'

export type CreateScrumTeamQueryServiceDto = {
  employees: { id: number; name: string }[]
}

export class CreateScrumTeamQueryService {
  constructor(
    private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository(),
    private readonly employeeRepository: EmployeeRepositoryInterface = new EmployeeRepository()
  ) {}

  async exec(): Promise<CreateScrumTeamQueryServiceDto> {
    const employees = await this.employeeRepository.findAll()
    const scrumTeam = await this.scrumTeamRepository.fetchOrFail() // TODO: findOrNull のメソッドを作る

    const employeeIdsWithoutPoAndSm = employees
      .filter((employee) => {
        const isPo = scrumTeam.getProductOwnerId().equals(employee.id)
        const isSm = scrumTeam.getScrumMasterId().equals(employee.id)
        return !isPo && !isSm
      })
      .map((employee) => ({
        id: employee.id.toInt(),
        name: employee.employeeName.getFullName(),
      }))

    return {
      employees: employeeIdsWithoutPoAndSm,
    }
  }
}
