'use server'

import { CreateScrumTeamWebCommand, DisbandScrumTeamWebCommand, EditScrumTeamWebCommand } from '@panda-project/gateway'
import { ScrumTeamUseCase } from '@panda-project/use-case'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const updateTeam = async (_: any, formData: FormData) => {
  const schema = z.object({
    scrumTeamId: z.string(),
    productOwnerId: z.string(),
    scrumMasterId: z.string(),
    developerIds: z.array(z.string()).min(0).max(10),
  })

  try {
    const parsed = schema.parse({
      scrumTeamId: formData.get('scrum-team-id'),
      productOwnerId: formData.get('product-owner-id'),
      scrumMasterId: formData.get('scrum-master-id'),
      developerIds: formData.getAll('developers'),
    })

    const isCreate = parsed.scrumTeamId === ''
    if (isCreate) {
      const command = new CreateScrumTeamWebCommand(parsed.productOwnerId, parsed.scrumMasterId, parsed.developerIds)
      await new ScrumTeamUseCase().create(command)
    } else {
      const command = new EditScrumTeamWebCommand(parsed.productOwnerId, parsed.scrumMasterId, parsed.developerIds)
      await new ScrumTeamUseCase().edit(command)
    }
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return {
        errors: {
          ...e.formErrors.fieldErrors,
        },
      }
    }

    return {
      errors: e instanceof Error ? [e.message] : [],
    }
  }

  redirect('./')
}

export const deleteTeam = async (prevState: any, formData: FormData) => {
  const schema = z.object({
    teamId: z.string(),
  })

  try {
    const parsed = schema.parse({
      teamId: formData.get('team-id'),
    })

    const command = new DisbandScrumTeamWebCommand(parsed.teamId)
    await new ScrumTeamUseCase().disband(command)
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return {
        errors: {
          type: 'error',
          ...e.formErrors.fieldErrors,
        },
      }
    }

    return {
      type: 'error',
      errors: e instanceof Error ? [e.message] : [],
    }
  }
  redirect('./')
}
