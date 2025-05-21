import { EmployeeId, ScrumTeamId } from '@panda-project/core'

export interface CreateScrumTeamCommand {
  getProductOwnerId(): EmployeeId
  getScrumMasterId(): EmployeeId
  getDeveloperIds(): EmployeeId[]
}

export interface EditScrumTeamCommand {
  getProductOwnerId(): EmployeeId
  getScrumMasterId(): EmployeeId
  getDeveloperIds(): EmployeeId[]
}

export interface AddDeveloperCommand {
  getDeveloperId(): EmployeeId
}

export interface RemoveDeveloperCommand {
  getDeveloperId(): EmployeeId
}

export interface DisbandScrumTeamCommand {
  getScrumTeamId(): ScrumTeamId
}
