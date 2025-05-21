import { ProjectName } from '@panda-project/core'

import { CreateProjectWebCommand } from '../project-command'

describe('CreateProjectWebCommand', () => {
  test('getProjectName', () => {
    const sut = new CreateProjectWebCommand('プロジェクト')
    expect(sut.getProjectName()).toEqual(new ProjectName('プロジェクト'))
  })
})
