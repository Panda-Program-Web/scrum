import { ScrumTeamRepository } from '../scrum-team-repository';
import {ScrumTeam, ScrumTeamId} from "@panda-project/core";
import {EmployeesSchema, Low, ProductOwnersSchema, ScrumTeamsSchema} from "@/external/lowdb";
import { setupDataBase } from './helper/database';

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
const productOwnerFixture = async (data: Partial<ProductOwnersSchema[number] & EmployeesSchema[number]> = null): Promise<ProductOwnersSchema[number]> => {
  const employee = {
    id: "",
    first_name: "",
    family_name: "",
  }
  const testData = fabricate({
    scrum_team_id: data?.scrum_team_id,
    employee_id: data?.employee_id,
  })
  await mockDb.read()
  const { employees, productOwners } = mockDb.data
  employees.push(employee)
  productOwners.push(testData)
  await mockDb.write()
  return testData
}

