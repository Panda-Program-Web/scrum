import { EmployeeId, ScrumTeamId } from '@panda-project/core'

import { CreateScrumTeamCommand, DisbandScrumTeamCommand, EditScrumTeamCommand } from '@panda-project/use-case'

export class CreateScrumTeamWebCommand implements CreateScrumTeamCommand {
  constructor(
    private readonly productOwnerId: string,
    private readonly scrumMasterId: string,
    private readonly developerIds: string[]
  ) {}

  getProductOwnerId(): EmployeeId {
    return new EmployeeId(Number.parseInt(this.productOwnerId, 10))
  }

  getScrumMasterId(): EmployeeId {
    return new EmployeeId(Number.parseInt(this.scrumMasterId, 10))
  }

  getDeveloperIds(): EmployeeId[] {
    const filteredIds = this.developerIds.filter((id) => id !== '')

    // 重複の有無をチェック。ID の重複を排除するために Set を使う
    const uniqueIds = new Set(filteredIds)
    if (uniqueIds.size !== filteredIds.length) {
      throw new Error('開発者が重複しています')
    }

    return filteredIds.map((id) => new EmployeeId(Number.parseInt(id, 10)))
  }
}

export class EditScrumTeamWebCommand implements EditScrumTeamCommand {
  constructor(
    private readonly productOwnerId: string,
    private readonly scrumMasterId: string,
    private readonly developerIds: string[]
  ) {}

  getProductOwnerId(): EmployeeId {
    return new EmployeeId(Number.parseInt(this.productOwnerId, 10))
  }

  getScrumMasterId(): EmployeeId {
    return new EmployeeId(Number.parseInt(this.scrumMasterId, 10))
  }

  getDeveloperIds(): EmployeeId[] {
    const filteredIds = this.developerIds.filter((id) => id !== '')

    // 重複の有無をチェック。ID の重複を排除するために Set を使う
    const uniqueIds = new Set(filteredIds)
    if (uniqueIds.size !== filteredIds.length) {
      throw new Error('開発者が重複しています')
    }

    return filteredIds.map((id) => new EmployeeId(Number.parseInt(id, 10)))
  }
}

export class DisbandScrumTeamWebCommand implements DisbandScrumTeamCommand {
  constructor(private readonly scrumTeamId: string) {}

  getScrumTeamId(): ScrumTeamId {
    return new ScrumTeamId(Number.parseInt(this.scrumTeamId, 10))
  }
}
