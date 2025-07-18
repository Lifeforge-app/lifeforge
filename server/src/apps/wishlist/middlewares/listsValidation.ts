import { body, param } from 'express-validator'

export const validateListId = param('id').isString()

export const validateListData = [
  body('name').isString(),
  body('description').isString().optional(),
  body('color').notEmpty().isHexColor(),
  body('icon').isString()
]
