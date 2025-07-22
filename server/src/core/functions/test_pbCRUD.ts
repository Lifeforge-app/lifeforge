import { getFullList } from './PocketBaseCRUDActions/getFullList'

// Test the function with a valid collection key
const test = getFullList('virtual_wardrobe__entries')

// This should now work without type errors
test
  .filter([
    {
      field: 'name',
      operator: '=',
      value: 'test'
    }
  ])
  .sort(['name', '-created'])

console.log('Type check passed!')
