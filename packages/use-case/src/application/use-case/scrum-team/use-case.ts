import {
  Developer,
  EmployeeRepositoryInterface,
  ProductOwner,
  ScrumMaster,
  ScrumTeam,
  ScrumTeamRepositoryInterface,
} from '@panda-project/core'

import {
  AddDeveloperCommand,
  CreateScrumTeamCommand,
  DisbandScrumTeamCommand,
  EditScrumTeamCommand,
  RemoveDeveloperCommand,
} from '@/application/use-case/scrum-team'
import { EmployeeRepository, ScrumTeamRepository } from '@panda-project/gateway'

export class ScrumTeamUseCase {
  constructor(
    private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository(),
    private readonly employeeRepository: EmployeeRepositoryInterface = new EmployeeRepository()
  ) {}

  async create(command: CreateScrumTeamCommand) {
    const { newProductOwner, newScrumMaster, developers } = await this.createScrumMembersFromCommand(command)

    const scrumTeamExists = await this.scrumTeamRepository.exists()
    if (scrumTeamExists) {
      throw new Error('スクラムチームはすでに作成されています')
    }

    const count = await this.employeeRepository.count()
    // TODO: スクラムチームクラスのドメインロジックに持っていく？
    if (count <= 1) {
      throw new Error(`スクラムチームを作成するためには、社員が2人以上登録されている必要があります。社員数: ${count}名`)
    }

    const newScrumTeam = ScrumTeam.createNew(newProductOwner, newScrumMaster, developers)
    await this.scrumTeamRepository.save(newScrumTeam)
  }

  async edit(command: EditScrumTeamCommand) {
    const { newProductOwner, newScrumMaster, developers } = await this.createScrumMembersFromCommand(command)

    const prevScrumTeam = await this.scrumTeamRepository.fetchOrFail()
    const newScrumTeam = prevScrumTeam
      .changeProductOwner(newProductOwner)
      .changeScrumMaster(newScrumMaster)
      .updateDevelopers(developers)
    await this.scrumTeamRepository.update(newScrumTeam)
  }

  private async createScrumMembersFromCommand(command: CreateScrumTeamCommand | EditScrumTeamCommand) {
    const newProductOwnerId = command.getProductOwnerId()
    const newScrumMasterId = command.getScrumMasterId()
    if (newProductOwnerId.equals(newScrumMasterId)) {
      throw new Error('プロダクトオーナーはスクラムマスターを兼任できません')
    }
    const developerIds = command.getDeveloperIds()

    // プロダクトオーナー
    const productOwnerEmployee = await this.employeeRepository.findByIdOrFail(newProductOwnerId)
    const newProductOwner = ProductOwner.createFromEmployee(productOwnerEmployee)
    // スクラムマスター
    const scrumMasterEmployee = await this.employeeRepository.findByIdOrFail(newScrumMasterId)
    const newScrumMaster = ScrumMaster.createFromEmployee(scrumMasterEmployee)
    // 開発者
    const developers = []
    for (const developerId of developerIds) {
      const developerEmployee = await this.employeeRepository.findByIdOrFail(developerId)
      const developer = Developer.createFromEmployee(developerEmployee)
      developers.push(developer)
    }

    return { newProductOwner, newScrumMaster, developers }
  }

  async addDeveloper(command: AddDeveloperCommand) {
    const developerId = command.getDeveloperId()
    const developerEmployee = await this.employeeRepository.findByIdOrFail(developerId)
    const developer = Developer.createFromEmployee(developerEmployee)

    const prevScrumTeam = await this.scrumTeamRepository.fetchOrFail()
    // TODO: スクラムチームクラスのドメインロジックに持っていく
    if (prevScrumTeam.developers.length >= 8) {
      throw new Error('スクラムチームに参加できる開発者は8名までです')
    }
    if (prevScrumTeam.isScrumTeamDeveloper(developerEmployee.id)) {
      throw new Error('すでに開発者として参加しています')
    }

    const newScrumTeam = prevScrumTeam.addDeveloper(developer)
    await this.scrumTeamRepository.update(newScrumTeam)
  }

  async removeDeveloper(command: RemoveDeveloperCommand) {
    const scrumTeam = await this.scrumTeamRepository.fetchOrFail()
    // TODO: スクラムチームクラスのドメインロジックに持っていく
    if (scrumTeam.developers.length === 0) {
      throw new Error('スクラムチームに開発者がいません')
    }

    const developerId = command.getDeveloperId()
    const developer = scrumTeam.getDeveloperByEmployeeId(developerId)
    const newScrumTeam = scrumTeam.removeDeveloper(developer)
    await this.scrumTeamRepository.update(newScrumTeam)
  }

  async disband(command: DisbandScrumTeamCommand) {
    const scrumTeamId = command.getScrumTeamId()
    const scrumTeam = await this.scrumTeamRepository.fetchOrFail()

    if (!scrumTeam.id.equals(scrumTeamId)) {
      throw new Error('削除しようとしているスクラムチームは存在しません')
    }

    await this.scrumTeamRepository.delete()
  }
}
