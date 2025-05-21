import { EmployeeId, EmployeeName } from '@panda-project/core'

import { CreateEmployeeCommand, EditEmployeeCommand, RemoveEmployeeCommand } from '@panda-project/use-case'

export class CreateEmployeeWebCommand implements CreateEmployeeCommand {
  constructor(
    private readonly familyName: string,
    private readonly firstName: string
  ) {}

  getEmployeeName(): EmployeeName {
    return new EmployeeName(this.firstName, this.familyName)
  }
}

export class EditEmployeeWebCommand implements EditEmployeeCommand {
  constructor(
    private readonly employeeId: number,
    private readonly newFamilyName: string,
    private readonly newFirstName: string
  ) {}

  getEmployeeId(): EmployeeId {
    return new EmployeeId(this.employeeId)
  }

  getNewEmployeeName(): EmployeeName {
    return new EmployeeName(this.newFirstName, this.newFamilyName)
  }
}

export class RemoveEmployeeWebCommand implements RemoveEmployeeCommand {
  constructor(private readonly employeeId: number) {}

  getEmployeeId(): EmployeeId {
    return new EmployeeId(this.employeeId)
  }
}
