import { ScrumTeamRepositoryInterface } from '@panda-project/core'

import { ScrumTeamRepository } from '@panda-project/gateway'

type Dto = {
  scrumTeamId: number
}

export class DisbandScrumTeamQueryService {
  constructor(private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()) {}

  async exec(): Promise<Dto> {
    const scrumTeam = await this.scrumTeamRepository.fetchOrFail()
    return { scrumTeamId: scrumTeam.id.toInt() }
  }
}
