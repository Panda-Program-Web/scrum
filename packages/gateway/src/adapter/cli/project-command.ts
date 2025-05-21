import { CreateProjectCommand, ProjectName } from '@panda-project/core'

export class CreateProjectCliCommand implements CreateProjectCommand {
  constructor(private readonly projectName: string) {}

  getProjectName(): ProjectName {
    return new ProjectName(this.projectName)
  }
}
