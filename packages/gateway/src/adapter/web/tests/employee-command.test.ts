import { EmployeeId } from '@panda-project/core'

import { CreateEmployeeWebCommand, EditEmployeeWebCommand, RemoveEmployeeWebCommand } from '../employee-command'

describe('CreateEmployeeWebCommand', () => {
  const sut = new CreateEmployeeWebCommand('社員', '一号')

  test('getEmployeeName', () => {
    expect(sut.getEmployeeName().getFullName()).toBe('社員 一号')
  })
})

describe('EditEmployeeWebCommand', () => {
  const sut = new EditEmployeeWebCommand(1, '社員', '一号')

  test('getEmployeeId', () => {
    expect(sut.getEmployeeId()).toEqual(new EmployeeId(1))
  })

  test('getNewEmployeeName', () => {
    expect(sut.getNewEmployeeName().getFullName()).toBe('社員 一号')
  })
})

describe('RemoveEmployeeWebCommand', () => {
  const sut = new RemoveEmployeeWebCommand(1)

  test('getEmployeeId', () => {
    expect(sut.getEmployeeId()).toEqual(new EmployeeId(1))
  })
})
