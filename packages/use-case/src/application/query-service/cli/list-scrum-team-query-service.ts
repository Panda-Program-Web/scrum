import { ScrumTeamRepositoryInterface } from '@panda-project/core'

import { ScrumTeamRepository } from '@panda-project/gateway'

type Dto = {
  poName: string
  smName: string
  developerNames: string[]
}

export class ListScrumTeamQueryService {
  constructor(private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()) {}

  async exec(): Promise<Dto> {
    const { productOwner, scrumMaster, developers } = await this.scrumTeamRepository.fetchOrFail()
    return {
      poName: productOwner.getFullName(),
      smName: scrumMaster.getFullName(),
      developerNames: developers.map((developer) => developer.getFullName()),
    }
  }
}

export class ListScrumTeamPresenter {
  exec(dto: Dto) {
    const { poName, smName, developerNames } = dto
    const developerBody =
      developerNames.length === 0
        ? '開発者はいません'
        : `開発者（${developerNames.length}名）: ${developerNames.join(', ')}`
    return `プロダクトオーナー: ${poName}
スクラムマスター: ${smName}
${developerBody}`
  }
}
