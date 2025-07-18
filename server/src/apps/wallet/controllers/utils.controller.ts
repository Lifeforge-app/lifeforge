import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { WalletControllersSchemas } from 'shared/types/controllers'

import * as UtilsService from '../services/utils.service'

const walletUtilsRouter = express.Router()

const getTypesCount = forgeController
  .route('GET /types-count')
  .description('Get wallet transaction types count and accumulation')
  .schema(WalletControllersSchemas.Utils.getTypesCount)
  .callback(async ({ pb }) => await UtilsService.getTypesCount(pb))

const getIncomeExpensesSummary = forgeController
  .route('GET /income-expenses')
  .description('Get income and expenses summary for a specific month/year')
  .schema(WalletControllersSchemas.Utils.getIncomeExpensesSummary)
  .callback(
    async ({ pb, query: { year, month } }) =>
      await UtilsService.getIncomeExpensesSummary(pb, year, month)
  )

const getExpensesBreakdown = forgeController
  .route('GET /expenses-breakdown')
  .description('Get expenses breakdown by category for a specific month/year')
  .schema(WalletControllersSchemas.Utils.getExpensesBreakdown)
  .callback(
    async ({ pb, query: { year, month } }) =>
      await UtilsService.getExpensesBreakdown(pb, year, month)
  )

bulkRegisterControllers(walletUtilsRouter, [
  getTypesCount,
  getIncomeExpensesSummary,
  getExpensesBreakdown
])

export default walletUtilsRouter
