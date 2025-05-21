import { ScrumTeamRepositoryInterface } from '@panda-project/core'

import { ScrumTeamRepository } from '@panda-project/gateway'

export type RemoveDeveloperQueryServiceDto = {
  developers: { id: number; name: string }[]
}

export class RemoveDeveloperQueryService {
  constructor(private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()) {}

  async exec(): Promise<RemoveDeveloperQueryServiceDto> {
    const scrumTeam = await this.scrumTeamRepository.fetchOrFail()
    const developers = scrumTeam.developers.map((developer) => ({
      id: developer.getEmployeeId().toInt(),
      name: developer.getFullName(),
    }))

    return { developers }
  }
}
