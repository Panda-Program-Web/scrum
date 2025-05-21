import {Employee, EmployeeId, EmployeeName} from '@panda-project/core'

import { EmployeeRepository } from '../employee-repository'

import { setupDataBase } from './helper/database'

import { EmployeesSchema, Low } from '@/external/lowdb'

let repository: EmployeeRepository
let mockDb: Low
beforeEach(async () => {
  const { db } = await setupDataBase()
  mockDb = db
  repository = new EmployeeRepository(mockDb)
})

// テストデータを作る
const fabricate = (data: Partial<EmployeesSchema> = null): EmployeesSchema => {
  return {
    id: data?.id ?? 900,
    first_name: data?.first_name ?? '名前',
    family_name: data?.family_name ?? '苗字',
  }
}

// テストデータをDBに保存する
const fixture = async (data: Partial<EmployeesSchema> = null): Promise<EmployeesSchema> => {
  const testData = fabricate(data)
  await mockDb.read()
  const { employees } = mockDb.data
  employees.push(testData)
  await mockDb.write()
  return testData
}

describe('findByIdOrFail', () => {
  test('社員が存在する時は社員を返す', async () => {
    // arrange
    await fixture()
    // act
    const actual = await repository.findByIdOrFail(new EmployeeId(900))
    // assert
    expect(actual).toBeInstanceOf(Employee)
    expect(actual.id.value).toBe(900)
    expect(actual.employeeName.firstName).toBe('名前')
    expect(actual.employeeName.familyName).toBe('苗字')
  })

  test('社員が存在しない時はエラーを返す', async () => {
    const id = new EmployeeId(999)
    await expect(repository.findByIdOrFail(id)).rejects.toThrowError(`社員ID 999 は存在しません`)
  })
})

describe('findAll', () => {
  test('社員が存在する時は社員を返す', async () => {
    await fixture({ id: 900, first_name: '名前', family_name: '苗字' })
    await fixture({ id: 901, first_name: '名前2', family_name: '苗字2' })

    const actual = await repository.findAll()
    expect(actual.length).toBe(2)
    expect(actual[0].id.value).toBe(900)
    expect(actual[0].employeeName.firstName).toBe('名前')
    expect(actual[0].employeeName.familyName).toBe('苗字')
    expect(actual[1].id.value).toBe(901)
    expect(actual[1].employeeName.firstName).toBe('名前2')
    expect(actual[1].employeeName.familyName).toBe('苗字2')
  })

  test('社員が存在しない時は空配列を返す', async () => {
    const actual = await repository.findAll()
    expect(actual.length).toBe(0)
  })
})

describe('count', () => {
  test('社員が0人の時は0を返す', async () => {
    const actual = await repository.count()
    expect(actual).toBe(0)
  })

  test('社員が2人の時は2を返す', async () => {
    await fixture({ id: 900, first_name: '名前', family_name: '苗字' })
    await fixture({ id: 901, first_name: '名前2', family_name: '苗字2' })

    const actual = await repository.count()
    expect(actual).toBe(2)
  })
})

describe('save', () => {
  test('新しい社員を保存したとき、新しい従業員を返す', async () => {
    const employee = new Employee(EmployeeId.createAsNull(), new EmployeeName('名前', '苗字'))
    const actual = await repository.save(employee)

    expect(actual.id.value).toBe(1)
    expect(actual.employeeName.firstName).toBe('名前')
    expect(actual.employeeName.familyName).toBe('苗字')
    // db のチェック
    const record = mockDb.data.employees[0]
    expect(record['id']).toBe(1)
    expect(record['first_name']).toBe('名前')
    expect(record['family_name']).toBe('苗字')
  })

  test('既存の社員を保存したとき、例外を投げる', async () => {
    const employee = new Employee(new EmployeeId(900), new EmployeeName('名前', '苗字'))

    await expect(repository.save(employee)).rejects.toThrowError(
      '社員IDはnullである必要があります。社員の更新は update メソッドを使ってください'
    )
  })
})

describe('update', () => {
  test('既存の社員を更新したとき、更新した従業員を返す', async () => {
    await fixture()
    const employee = new Employee(new EmployeeId(900), new EmployeeName('新しい名前', '新しい苗字'))
    const actual = await repository.update(employee)

    expect(actual.id.value).toBe(900)
    expect(actual.employeeName.firstName).toBe('新しい名前')
    expect(actual.employeeName.familyName).toBe('新しい苗字')
    // db のチェック
    const record = mockDb.data.employees[0]
    expect(record['id']).toBe(900)
    expect(record['first_name']).toBe('新しい名前')
    expect(record['family_name']).toBe('新しい苗字')
  })

  test('新規の社員を更新したとき、例外を投げる', async () => {
    const employee = new Employee(EmployeeId.createAsNull(), new EmployeeName('名前', '苗字'))

    await expect(repository.update(employee)).rejects.toThrowError('値が null です')
  })
})

describe('delete', () => {
  test('既存の社員を削除できる', async () => {
    await fixture()

    const employee = new Employee(new EmployeeId(900), new EmployeeName('名前', '苗字'))
    await repository.delete(employee)

    expect(mockDb.data.employees.length).toBe(0)
  })

  test('存在しない社員を削除しようとすると例外を投げる', async () => {
    const employee = new Employee(new EmployeeId(800), new EmployeeName('名前', '苗字'))
    await expect(repository.delete(employee)).rejects.toThrowError('社員ID 800 は存在しません')
  })
})
