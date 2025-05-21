import { ProjectName } from '@panda-project/core'

import { CreateProjectCommand } from '@panda-project/use-case'

export class CreateProjectCliCommand implements CreateProjectCommand {
  constructor(private readonly projectName: string) {}

  getProjectName(): ProjectName {
    return new ProjectName(this.projectName)
  }
}
