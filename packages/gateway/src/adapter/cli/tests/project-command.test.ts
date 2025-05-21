import { ProjectName } from '@panda-project/core'

import { CreateProjectCliCommand } from '../project-command'

describe('CreateProjectCliCommand', () => {
  test('getProjectName', () => {
    const sut = new CreateProjectCliCommand('プロジェクト')
    expect(sut.getProjectName()).toEqual(new ProjectName('プロジェクト'))
  })
})
