import { ProductName } from '@panda-project/core'

import { CreateProductCliCommand } from '../product-command'

describe('CreateProductCliCommand', () => {
  test('getProductName', () => {
    const sut = new CreateProductCliCommand('プロダクト')
    expect(sut.getProductName()).toEqual(new ProductName('プロダクト'))
  })
})
