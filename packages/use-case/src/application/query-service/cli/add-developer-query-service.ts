import { EmployeeRepositoryInterface, ScrumTeamRepositoryInterface } from '@panda-project/core'

import { EmployeeRepository, ScrumTeamRepository } from '@panda-project/gateway'

export type AddDeveloperQueryServiceDto = {
  candidateEmployees: { id: number; name: string }[]
}

export class AddDeveloperQueryService {
  constructor(
    private readonly employeeRepository: EmployeeRepositoryInterface = new EmployeeRepository(),
    private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()
  ) {}

  async exec(): Promise<AddDeveloperQueryServiceDto> {
    const employees = await this.employeeRepository.findAll()
    const scrumTeam = await this.scrumTeamRepository.fetchOrFail()
    const allScrumMemberDeveloperIds = scrumTeam.getDeveloperIds()

    const candidateEmployees = employees
      .filter((employee) => !allScrumMemberDeveloperIds.includes(employee.id))
      .map((employee) => ({
        id: employee.id.toInt(),
        name: employee.employeeName.getFullName(),
      }))

    return {
      candidateEmployees,
    }
  }
}
