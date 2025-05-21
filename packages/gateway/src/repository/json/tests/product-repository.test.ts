import { ProductRepository } from '../product-repository';
import {Product, ProductId, ProductName} from "@panda-project/core";
import {ProductsSchema, Low} from "@/external/lowdb";
import { setupDataBase } from './helper/database';

let repository: ProductRepository
let mockDb: Low
beforeEach(async () => {
  const { db } = await setupDataBase()
  mockDb = db
  repository = new ProductRepository(mockDb)
})

// テストデータを作る
const fabricate = (data: Partial<ProductsSchema[number]> = null): ProductsSchema[number] => {
  return {
    id: data?.id ?? 100,
    name: data?.name ?? 'テスト用プロダクト',
  }
}

// テストデータをDBに保存する
const fixture = async (data: Partial<ProductsSchema[number]> = null): Promise<ProductsSchema[number]> => {
  const testData = fabricate(data)
  await mockDb.read()
  const { products } = mockDb.data
  products.push(testData)
  await mockDb.write()
  return testData
}

describe('fetch', () => {
  test('プロダクトが存在する時はプロダクトを返す', async () => {
    // arrange
    await fixture()
    // act
    const actual = await repository.fetch()
    // assert
    expect(actual).toBeInstanceOf(Product)
    expect(actual.id.value).toBe(100)
    expect(actual.name.value).toBe('テスト用プロダクト')
  })

  test('プロダクトが存在しない時はnullを返す', async () => {
    const actual = await repository.fetch()
    expect(actual).toBeNull()
  })
})

describe('findByNameOrFail', () => {
  test('プロダクトが存在する時はプロダクトを返す', async () => {
    // arrange
    await fixture()
    // act
    const actual = await repository.findByNameOrFail(new ProductName('テスト用プロダクト'))
    // assert
    expect(actual).toBeInstanceOf(Product)
    expect(actual.id.value).toBe(100)
    expect(actual.name.value).toBe('テスト用プロダクト')
  })

  test('プロダクトが存在しない時はエラーを返す', async () => {
    const name = new ProductName('存在しないプロダクト')
    await expect(repository.findByNameOrFail(name)).rejects.toThrowError('プロダクトが存在しません')
  })
})

describe('existsWithoutId', () => {
  test('プロダクトが存在する時はtrueを返す', async () => {
    await fixture()
    const actual = await repository.existsWithoutId()
    expect(actual).toBeTruthy()
  })

  test('プロダクトが存在しない時はfalseを返す', async () => {
    const actual = await repository.existsWithoutId()
    expect(actual).toBeFalsy()
  })
})

describe('save', () => {
  test('プロダクトを保存する', async () => {
    const product = new Product(ProductId.createAsNull(), new ProductName('新規プロダクト'))
    const actual = await repository.save(product)
    expect(actual).toBeInstanceOf(Product)
    expect(actual.id.value).toBe(1)
    expect(actual.name.value).toBe('新規プロダクト')
  })
})
