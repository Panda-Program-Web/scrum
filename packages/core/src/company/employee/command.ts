import { EmployeeName, EmployeeId } from '@panda-project/core'

export interface CreateEmployeeCommand {
  getEmployeeName(): EmployeeName
}

export interface CreateMultipleEmployeeCommand {
  getEmployeeNames(): EmployeeName[]
}

export interface EditEmployeeCommand {
  getEmployeeId(): EmployeeId
  getNewEmployeeName(): EmployeeName
}

export interface RemoveEmployeeCommand {
  getEmployeeId(): EmployeeId
}
