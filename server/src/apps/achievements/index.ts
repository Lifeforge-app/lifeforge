import forgeRouter from '@functions/forgeRouter'

import {
  createEntry,
  deleteEntry,
  getAllEntriesByDifficulty,
  updateEntry
} from './controllers/entries.controller'

export default forgeRouter({
  entries: {
    getAllByDifficulty: getAllEntriesByDifficulty,
    create: createEntry,
    update: updateEntry,
    delete: deleteEntry
  }
})
