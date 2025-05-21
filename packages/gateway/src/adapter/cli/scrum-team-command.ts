import { EmployeeId, ScrumTeamId } from '@panda-project/core'

import {
  AddDeveloperCommand,
  CreateScrumTeamCommand,
  DisbandScrumTeamCommand,
  EditScrumTeamCommand,
  RemoveDeveloperCommand,
} from '@/application/use-case/scrum-team'

export class CreateScrumTeamCliCommand implements CreateScrumTeamCommand {
  constructor(
    private readonly productOwnerId: number,
    private readonly scrumMasterId: number
  ) {}

  getProductOwnerId(): EmployeeId {
    return new EmployeeId(this.productOwnerId)
  }

  getScrumMasterId(): EmployeeId {
    return new EmployeeId(this.scrumMasterId)
  }

  getDeveloperIds(): EmployeeId[] {
    // CLI の場合、チーム作成時に開発者は指定しない
    return []
  }
}

export class EditScrumTeamCliCommand implements EditScrumTeamCommand {
  constructor(
    private readonly productOwnerId: number,
    private readonly scrumMasterId: number,
    private readonly developerIds: number[]
  ) {}

  getProductOwnerId(): EmployeeId {
    return new EmployeeId(this.productOwnerId)
  }

  getScrumMasterId(): EmployeeId {
    return new EmployeeId(this.scrumMasterId)
  }

  getDeveloperIds(): EmployeeId[] {
    return this.developerIds.map((id) => new EmployeeId(id))
  }
}

export class AddDeveloperCliCommand implements AddDeveloperCommand {
  constructor(private readonly developerId: number) {}

  getDeveloperId(): EmployeeId {
    return new EmployeeId(this.developerId)
  }
}

export class RemoveDeveloperCliCommand implements RemoveDeveloperCommand {
  constructor(private readonly developerId: number) {}

  getDeveloperId(): EmployeeId {
    return new EmployeeId(this.developerId)
  }
}

export class DisbandScrumTeamCliCommand implements DisbandScrumTeamCommand {
  constructor(private readonly scrumTeamId: number) {}

  getScrumTeamId(): ScrumTeamId {
    return new ScrumTeamId(this.scrumTeamId)
  }
}
