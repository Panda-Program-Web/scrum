import { ProductName, ProjectName } from '@panda-project/core'

import { InitCliCommand } from '../init-scenario-command'

describe('InitCliCommand', () => {
  test('getCreateProductCommand', () => {
    const sut = new InitCliCommand('プロダクト', 'プロジェクト')
    expect(sut.getCreateProductCommand().getProductName()).toEqual(new ProductName('プロダクト'))
  })

  test('getCreateProjectCommand', () => {
    const sut = new InitCliCommand('プロジェクト', 'プロジェクト')
    expect(sut.getCreateProjectCommand().getProjectName()).toEqual(new ProjectName('プロジェクト'))
  })
})
