import { ProjectRepository } from '../project-repository';
import {Project, ProjectId, ProjectName} from "@panda-project/core";
import {Low, ProjectsSchema} from "@/external/lowdb";
import { setupDataBase } from './helper/database';

let repository: ProjectRepository
let mockDb: Low
beforeEach(async () => {
  const { db } = await setupDataBase()
  mockDb = db
  repository = new ProjectRepository(mockDb)
})

// テストデータを作る
const fabricate = (data: Partial<ProjectsSchema[number]> = null): ProjectsSchema[number] => {
  return {
    id: data?.id ?? 100,
    name: data?.name ?? 'テスト用プロジェクト',
  }
}

// テストデータをDBに保存する
const fixture = async (data: Partial<ProjectsSchema[number]> = null): Promise<ProjectsSchema[number]> => {
  const testData = fabricate(data)
  await mockDb.read()
  const { projects } = mockDb.data
  projects.push(testData)
  await mockDb.write()
  return testData
}

describe('fetch', () => {
  test('プロジェクトが存在する時はプロジェクトを返す', async () => {
    // arrange
    await fixture()
    // act
    const actual = await repository.fetch()
    // assert
    expect(actual).toBeInstanceOf(Project)
    expect(actual?.id.value).toBe(100)
    expect(actual?.name.value).toBe('テスト用プロジェクト')
  })

  test('プロジェクトが存在しない時はnullを返す', async () => {
    const actual = await repository.fetch()
    expect(actual).toBeNull()
  })
})

describe('save', () => {
  test('プロジェクトを保存できる', async () => {
    const project = new Project(new ProjectId(null), new ProjectName('テスト用プロジェクト'))
    const actual = await repository.save(project)
    expect(actual).toBeInstanceOf(Project)
    expect(actual.id.value).toBe(1)
    expect(actual.name.value).toBe('テスト用プロジェクト')
  })
})
