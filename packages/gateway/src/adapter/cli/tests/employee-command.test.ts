import { EmployeeId } from '@panda-project/core'

import {
  CreateEmployeeCliCommand,
  CreateMultipleEmployeeCliCommand,
  EditEmployeeCliCommand,
  RemoveEmployeeCliCommand,
} from '../employee-command'

describe('CreateEmployeeCliCommand', () => {
  test('getEmployeeName', () => {
    const sut = new CreateEmployeeCliCommand('社員 一号')
    expect(sut.getEmployeeName().getFullName()).toBe('社員 一号')
  })
})

describe('CreateMultipleEmployeeCliCommand', () => {
  test('getEmployeeNames', () => {
    const sut = new CreateMultipleEmployeeCliCommand('社員 一号, 社員 二号')
    expect(sut.getEmployeeNames().map((name) => name.getFullName())).toEqual(['社員 一号', '社員 二号'])
  })
})

describe('EditEmployeeCliCommand', () => {
  test('getEmployeeId', () => {
    const sut = new EditEmployeeCliCommand(1, '社員 一号')
    expect(sut.getEmployeeId()).toEqual(new EmployeeId(1))
  })

  test('getNewEmployeeName', () => {
    const sut = new EditEmployeeCliCommand(1, '社員 一号')
    expect(sut.getNewEmployeeName().getFullName()).toBe('社員 一号')
  })
})

describe('RemoveEmployeeCliCommand', () => {
  test('getEmployeeId', () => {
    const sut = new RemoveEmployeeCliCommand(1)
    expect(sut.getEmployeeId()).toEqual(new EmployeeId(1))
  })
})
