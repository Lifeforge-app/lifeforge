import { clientError } from '@functions/routes/utils/response'
import { Request, Response } from 'express'

export default async function checkExistence(
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  collection: string,
  id: string,
  sendError = true
): Promise<boolean> {
  const found =
    (await req.pb
      .collection(collection)
      .getOne(id)
      .then(() => true)
      .catch(() => {})) ?? false

  if (!found && sendError) {
    clientError(
      res,
      `Document with ID ${id} not found in collection ${collection}`,
      404
    )
  }

  return found
}
