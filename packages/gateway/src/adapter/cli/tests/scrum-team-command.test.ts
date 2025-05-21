import { EmployeeId, ScrumTeamId } from '@panda-project/core'

import {
  CreateScrumTeamCliCommand,
  EditScrumTeamCliCommand,
  AddDeveloperCliCommand,
  RemoveDeveloperCliCommand,
  DisbandScrumTeamCliCommand,
} from '../scrum-team-command'

describe('CreateScrumTeamCliCommand', () => {
  const sut = new CreateScrumTeamCliCommand(1, 2)

  test('getProductOwnerId', () => {
    expect(sut.getProductOwnerId()).toEqual(new EmployeeId(1))
  })

  test('getScrumMasterId', () => {
    expect(sut.getScrumMasterId()).toEqual(new EmployeeId(2))
  })

  test('getDeveloperIds', () => {
    expect(sut.getDeveloperIds()).toEqual([])
  })
})

describe('EditScrumTeamCliCommand', () => {
  const sut = new EditScrumTeamCliCommand(1, 2, [3])

  test('getProductOwnerId', () => {
    expect(sut.getProductOwnerId()).toEqual(new EmployeeId(1))
  })

  test('getScrumMasterId', () => {
    expect(sut.getScrumMasterId()).toEqual(new EmployeeId(2))
  })

  test('getDeveloperIds', () => {
    expect(sut.getDeveloperIds()).toEqual([new EmployeeId(3)])
  })
})

describe('AddDeveloperCliCommand', () => {
  const sut = new AddDeveloperCliCommand(1)

  test('getDeveloperId', () => {
    expect(sut.getDeveloperId()).toEqual(new EmployeeId(1))
  })
})

describe('RemoveDeveloperCliCommand', () => {
  const sut = new RemoveDeveloperCliCommand(1)

  test('getDeveloperId', () => {
    expect(sut.getDeveloperId()).toEqual(new EmployeeId(1))
  })
})

describe('DisbandScrumTeamCliCommand', () => {
  const sut = new DisbandScrumTeamCliCommand(1)

  test('getDeveloperId', () => {
    expect(sut.getScrumTeamId()).toEqual(new ScrumTeamId(1))
  })
})
