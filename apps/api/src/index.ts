import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { z } from 'zod'

import {
  CreateEmployeeWebCommand,
  EditEmployeeWebCommand,
  RemoveEmployeeWebCommand,
  InitWebCommand,
  CreateScrumTeamWebCommand,
  EditScrumTeamWebCommand,
  DisbandScrumTeamWebCommand,
} from '@panda-project/gateway'

import {
  EmployeeUseCase,
  InitScenario,
  ScrumTeamUseCase,
} from '@panda-project/use-case'

const app = new Hono()

app.post('/init', async (c) => {
  const schema = z.object({
    productName: z
      .string()
      .min(1)
      .max(30)
      .regex(/^[a-zA-Z0-9_-]*$/),
    projectName: z
      .string()
      .min(1)
      .max(30)
      .regex(/^[a-zA-Z0-9_-]*$/),
  })

  try {
    const { productName, projectName } = schema.parse(await c.req.json())
    const command = new InitWebCommand(productName, projectName)
    await new InitScenario().exec(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.post('/employees', async (c) => {
  const schema = z.object({
    familyName: z.string().min(1),
    firstName: z.string().min(1),
  })

  try {
    const { familyName, firstName } = schema.parse(await c.req.json())
    const command = new CreateEmployeeWebCommand(familyName, firstName)
    await new EmployeeUseCase().create(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.put('/employees/:id', async (c) => {
  const body = await c.req.json()
  const schema = z.object({
    familyName: z.string().min(1),
    firstName: z.string().min(1),
  })

  try {
    const { familyName, firstName } = schema.parse(body)
    const id = Number.parseInt(c.req.param('id'), 10)
    const command = new EditEmployeeWebCommand(id, familyName, firstName)
    await new EmployeeUseCase().edit(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.delete('/employees/:id', async (c) => {
  const schema = z.object({ id: z.string().regex(/^\d+$/) })
  try {
    const { id } = schema.parse({ id: c.req.param('id') })
    const command = new RemoveEmployeeWebCommand(Number.parseInt(id, 10))
    await new EmployeeUseCase().remove(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.post('/team', async (c) => {
  const schema = z.object({
    productOwnerId: z.string(),
    scrumMasterId: z.string(),
    developerIds: z.array(z.string()).min(0).max(10),
  })

  try {
    const { productOwnerId, scrumMasterId, developerIds } = schema.parse(
      await c.req.json()
    )
    const command = new CreateScrumTeamWebCommand(
      productOwnerId,
      scrumMasterId,
      developerIds
    )
    await new ScrumTeamUseCase().create(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.put('/team', async (c) => {
  const schema = z.object({
    productOwnerId: z.string(),
    scrumMasterId: z.string(),
    developerIds: z.array(z.string()).min(0).max(10),
  })

  try {
    const { productOwnerId, scrumMasterId, developerIds } = schema.parse(
      await c.req.json()
    )
    const command = new EditScrumTeamWebCommand(
      productOwnerId,
      scrumMasterId,
      developerIds
    )
    await new ScrumTeamUseCase().edit(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.delete('/team/:id', async (c) => {
  const schema = z.object({ id: z.string().regex(/^\d+$/) })

  try {
    const { id } = schema.parse({ id: c.req.param('id') })
    const command = new DisbandScrumTeamWebCommand(id)
    await new ScrumTeamUseCase().disband(command)
    return c.json({ message: 'ok' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ errors: e.formErrors.fieldErrors }, 400)
    }
    throw e
  }
})

app.onError((err, c) => {
  return c.json({ error: err.message }, 500)
})

const port = 8787
console.log(`Listening on http://localhost:${port}`)
serve({ fetch: app.fetch, port })

