import { Employee, EmployeeId, EmployeeRepositoryInterface, ScrumTeamRepositoryInterface } from '@panda-project/core'

import {
  CreateEmployeeCommand,
  CreateMultipleEmployeeCommand,
  EditEmployeeCommand,
  RemoveEmployeeCommand,
} from '@/application/use-case/employee'
import { EmployeeRepository, ScrumTeamRepository } from '@panda-project/gateway'

export class EmployeeUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepositoryInterface = new EmployeeRepository(),
    private readonly scrumTeamRepository: ScrumTeamRepositoryInterface = new ScrumTeamRepository()
  ) {}

  async create(command: CreateEmployeeCommand): Promise<void> {
    const count = await this.employeeRepository.count()
    if (count > 50) {
      throw new Error('登録できる従業員数の上限に達しました。登録可能な人数は50名以下です')
    }

    const employeeName = command.getEmployeeName()
    const employee = new Employee(EmployeeId.createAsNull(), employeeName)

    await this.employeeRepository.save(employee)
  }

  async createMultiple(command: CreateMultipleEmployeeCommand): Promise<void> {
    const names = command.getEmployeeNames()

    // n+1 だが、DB は json なので特に問題にしない。
    // RDB なら、bulk insert の処理を repository に実装する
    for (const name of names) {
      const count = await this.employeeRepository.count()
      if (count > 50) {
        throw new Error('登録できる従業員数の上限に達しました。登録可能な人数は50名以下です')
      }

      const employee = new Employee(EmployeeId.createAsNull(), name)
      await this.employeeRepository.save(employee)
    }
  }

  async edit(command: EditEmployeeCommand) {
    const employee = await this.employeeRepository.findByIdOrFail(command.getEmployeeId())
    const newName = command.getNewEmployeeName()
    const newEmployee = employee.updateName(newName)

    await this.employeeRepository.update(newEmployee)
  }

  async remove(command: RemoveEmployeeCommand) {
    const employee = await this.employeeRepository.findByIdOrFail(command.getEmployeeId())

    let scrumTeam = null
    try {
      scrumTeam = await this.scrumTeamRepository.fetchOrFail()
    } catch (e: unknown) {
      // スクラムチームが存在しない場合は、社員を削除できる
      await this.employeeRepository.delete(employee)
      return
    }

    const isBelongToScrumTeam = scrumTeam.isBelongTo(employee.id)
    if (isBelongToScrumTeam) {
      throw new Error('社員がスクラムチームに所属しているため、削除できません')
    }

    await this.employeeRepository.delete(employee)
  }
}
