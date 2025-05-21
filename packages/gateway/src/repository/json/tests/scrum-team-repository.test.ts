import { Low, ProductOwnersSchema, ScrumTeamsSchema } from '@/external/lowdb'
import { ScrumTeam, ScrumTeamId } from '@panda-project/core'
import { ScrumTeamRepository } from '../scrum-team-repository'
import { setupDataBase } from './helper/database'

let repository: ScrumTeamRepository
let mockDb: Low
beforeEach(async () => {
  const { db } = await setupDataBase()
  mockDb = db
  repository = new ScrumTeamRepository(mockDb)
})

// テストデータを作る
const fabricate = (data: Partial<ScrumTeamsSchema[number]> = null): ScrumTeamsSchema[number] => {
  return {
    id: data?.id ?? 100,
  }
}

// テストデータをDBに保存する
const fixture = async (data: Partial<ScrumTeamsSchema[number]> = null): Promise<ScrumTeamsSchema[number]> => {
  const testData = fabricate(data)
  await mockDb.read()
  const { scrumTeams } = mockDb.data
  scrumTeams.push(testData)
  await mockDb.write()
  return testData
}

// テストデータを作る
const fabricateProductOwner = (data: Partial<ProductOwnersSchema[number]> = null): ProductOwnersSchema[number] => {
  return {
    scrum_team_id: data?.scrum_team_id ?? 100,
    employee_id: data?.employee_id ?? 100,
  }
}

// テストデータをDBに保存する
describe('save', () => {
  // AI Generated Test
  it('should save new scrum team with members', async () => {
    const scrumTeam = new ScrumTeam(
      new ScrumTeamId(1),
      // Mock minimum required data
      { getEmployeeId: () => ({ toInt: () => 100 }) } as any, // ProductOwner
      { getEmployeeId: () => ({ toInt: () => 101 }) } as any, // ScrumMaster
      [{ getEmployeeId: () => ({ toInt: () => 102 }) } as any, { getEmployeeId: () => ({ toInt: () => 103 }) } as any] // Developers
    )

    await repository.save(scrumTeam)

    await mockDb.read()
    expect(mockDb.data.scrumTeams).toHaveLength(1)
    expect(mockDb.data.productOwners).toHaveLength(1)
    expect(mockDb.data.scrumMasters).toHaveLength(1)
    expect(mockDb.data.developers).toHaveLength(2)
  })
})
