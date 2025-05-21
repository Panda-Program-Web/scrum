import { EmployeeId, ScrumTeamId } from '@panda-project/core'

import { CreateScrumTeamWebCommand, EditScrumTeamWebCommand, DisbandScrumTeamWebCommand } from '../scrum-team-command'

describe('CreateScrumTeamWebCommand', () => {
  const sut = new CreateScrumTeamWebCommand('1', '2', [])

  test('getProductOwnerId', () => {
    expect(sut.getProductOwnerId()).toEqual(new EmployeeId(1))
  })

  test('getScrumMasterId', () => {
    expect(sut.getScrumMasterId()).toEqual(new EmployeeId(2))
  })

  describe('getDeveloperIds', () => {
    it('should return empty array', () => {
      const sut = new CreateScrumTeamWebCommand('1', '2', [])
      expect(sut.getDeveloperIds()).toEqual([])
    })

    it('should return array with two elements', () => {
      const sut = new CreateScrumTeamWebCommand('1', '2', ['3', '4'])
      expect(sut.getDeveloperIds()).toEqual([new EmployeeId(3), new EmployeeId(4)])
    })

    it('throws error when developer id is duplicated', () => {
      const sut = new CreateScrumTeamWebCommand('1', '2', ['3', '3'])
      expect(() => sut.getDeveloperIds()).toThrowError('開発者が重複しています')
    })
  })
})

describe('EditScrumTeamWebCommand', () => {
  const sut = new EditScrumTeamWebCommand('1', '2', ['3'])

  test('getProductOwnerId', () => {
    expect(sut.getProductOwnerId()).toEqual(new EmployeeId(1))
  })

  test('getScrumMasterId', () => {
    expect(sut.getScrumMasterId()).toEqual(new EmployeeId(2))
  })

  describe('getDeveloperIds', () => {
    it('should return empty array', () => {
      const sut = new EditScrumTeamWebCommand('1', '2', [])
      expect(sut.getDeveloperIds()).toEqual([])
    })

    it('should return array with two elements', () => {
      const sut = new EditScrumTeamWebCommand('1', '2', ['3', '4'])
      expect(sut.getDeveloperIds()).toEqual([new EmployeeId(3), new EmployeeId(4)])
    })

    it('throws error when developer id is duplicated', () => {
      const sut = new EditScrumTeamWebCommand('1', '2', ['3', '3'])
      expect(() => sut.getDeveloperIds()).toThrowError('開発者が重複しています')
    })
  })
})

describe('DisbandScrumTeamWebCommand', () => {
  const sut = new DisbandScrumTeamWebCommand('1')

  test('getDeveloperId', () => {
    expect(sut.getScrumTeamId()).toEqual(new ScrumTeamId(1))
  })
})
