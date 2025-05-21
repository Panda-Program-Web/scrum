'use server'

import { InitWebCommand } from '@panda-project/gateway'
import { InitScenario } from '@panda-project/use-case'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const createProductAndProject = async (prevState: any, formData: FormData) => {
  const validation = z
    .string()
    .min(1, '1文字以上入力してください')
    .max(30, '30文字以下で入力してください')
    .regex(/^[a-zA-Z0-9_-]*$/, '半角英数字と-_のみ使えます')
  const schema = z.object({
    productName: validation,
    projectName: validation,
  })

  const productName = formData.get('product-name')
  const projectName = formData.get('project-name')

  try {
    const parsed = schema.parse({ productName, projectName })
    const command = new InitWebCommand(parsed.productName, parsed.projectName)
    await new InitScenario().exec(command)
  } catch (e) {
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

  redirect(`/employees`)
}
