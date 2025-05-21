import { ProjectId, Project, ProjectName, ProjectRepositoryInterface } from '@panda-project/core'
import { Low } from 'lowdb'

import { JsonRepository } from './json-repository'

import { DataBase, db } from '@/external/lowdb'

export class ProjectRepository extends JsonRepository implements ProjectRepositoryInterface {
  constructor(private readonly lowdb: Low<DataBase> = db) {
    super()
  }

  private nextId(): ProjectId {
    return new ProjectId(this.calculateNewId(this.lowdb.data.projects))
  }

  async fetch(): Promise<Project | null> {
    await this.lowdb.read()
    const { projects } = this.lowdb.data

    if (projects.length === 0) {
      return null
    }

    return new Project(new ProjectId(projects[0].id), new ProjectName(projects[0].name))
  }

  async save(project: Project) {
    await this.lowdb.read()
    const { projects } = this.lowdb.data

    const projectId = this.nextId()
    projects.push({
      id: projectId.toInt(),
      name: project.name.value,
    })

    await this.lowdb.write()
    return new Project(projectId, project.name)
  }
}
