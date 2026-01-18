import { ClientError } from '@lifeforge/server-utils'
import { Request } from 'express'
import z from 'zod'

export default function parseQuery(
  req: Request,
  validator?: z.ZodTypeAny
): void {
  if (!validator) return

  const result = validator.safeParse(req.query)

  if (!result.success) {
    throw new ClientError(z.formatError(result.error).toString(), 400)
  }

  req.query = result.data as any
}
