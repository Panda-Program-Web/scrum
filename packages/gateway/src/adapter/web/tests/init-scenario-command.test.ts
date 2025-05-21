import { InitWebCommand } from '../init-scenario-command'
import { CreateProductWebCommand } from '../product-command'
import { CreateProjectWebCommand } from '../project-command'

describe('InitWebCommand', () => {
  const sut = new InitWebCommand('プロダクト', 'プロジェクト')

  test('getCreateProductCommand', () => {
    expect(sut.getCreateProductCommand()).toEqual(new CreateProductWebCommand('プロダクト'))
  })

  test('getCreateProjectCommand', () => {
    expect(sut.getCreateProjectCommand()).toEqual(new CreateProjectWebCommand('プロジェクト'))
  })
})
