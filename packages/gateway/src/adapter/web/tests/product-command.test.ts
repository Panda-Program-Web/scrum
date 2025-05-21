import { ProductName } from '@panda-project/core'

import { CreateProductWebCommand } from '../product-command'

describe('CreateProductWebCommand', () => {
  test('getProductName', () => {
    const sut = new CreateProductWebCommand('プロダクト')
    expect(sut.getProductName()).toEqual(new ProductName('プロダクト'))
  })
})
