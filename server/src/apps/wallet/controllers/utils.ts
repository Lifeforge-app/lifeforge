import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as UtilsService from '../services/utils.service'

const getTypesCount = forgeController
  .route('GET /types-count')
  .description('Get wallet transaction types count and accumulation')
  .input({})
  .callback(async ({ pb }) => await UtilsService.getTypesCount(pb))

const getIncomeExpensesSummary = forgeController
  .route('GET /income-expenses')
  .description('Get income and expenses summary for a specific month/year')
  .input({})
  .callback(
    async ({ pb, query: { year, month } }) =>
      await UtilsService.getIncomeExpensesSummary(pb, year, month)
  )

const getExpensesBreakdown = forgeController
  .route('GET /expenses-breakdown')
  .description('Get expenses breakdown by category for a specific month/year')
  .input({})
  .callback(
    async ({ pb, query: { year, month } }) =>
      await UtilsService.getExpensesBreakdown(pb, year, month)
  )

export default forgeRouter({
  getTypesCount,
  getIncomeExpensesSummary,
  getExpensesBreakdown
})
