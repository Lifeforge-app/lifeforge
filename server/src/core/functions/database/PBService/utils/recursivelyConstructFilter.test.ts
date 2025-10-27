import { describe, expect, it } from 'vitest'

import { recursivelyBuildFilter } from './recursivelyConstructFilter'

// Mock filter types for testing - using type assertion to bypass strict typing
type MockFilter =
  | {
      field: string
      operator:
        | '='
        | '!='
        | '>'
        | '<'
        | '>='
        | '<='
        | '~'
        | '!~'
        | '?='
        | '?!='
        | '?>'
        | '?<'
        | '?>='
        | '?<='
        | '?~'
        | '?!~'
      value: unknown
    }
  | {
      combination: '&&' | '||'
      filters: MockFilter[]
    }
  | undefined

// Helper function to create filter with proper typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFilter = (filter: MockFilter[]): any => filter

describe('recursivelyBuildFilter', () => {
  describe('simple filters', () => {
    it('should build a simple equality filter', () => {
      const filter = createFilter([
        {
          field: 'name',
          operator: '=',
          value: 'John Doe'
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('name={:param0}')
      expect(result.params).toEqual({ param0: 'John Doe' })
    })

    it('should build a simple inequality filter', () => {
      const filter = createFilter([
        {
          field: 'age',
          operator: '!=',
          value: 25
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('age!={:param0}')
      expect(result.params).toEqual({ param0: 25 })
    })

    it('should build a greater than filter', () => {
      const filter = createFilter([
        {
          field: 'score',
          operator: '>',
          value: 100
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('score>{:param0}')
      expect(result.params).toEqual({ param0: 100 })
    })

    it('should build a like filter', () => {
      const filter = createFilter([
        {
          field: 'email',
          operator: '~',
          value: '@example.com'
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('email~{:param0}')
      expect(result.params).toEqual({ param0: '@example.com' })
    })

    it('should build an optional equality filter', () => {
      const filter = createFilter([
        {
          field: 'status',
          operator: '?=',
          value: 'active'
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('status?={:param0}')
      expect(result.params).toEqual({ param0: 'active' })
    })
  })

  describe('multiple simple filters', () => {
    it('should combine multiple filters with AND by default', () => {
      const filter = createFilter([
        {
          field: 'name',
          operator: '=',
          value: 'John'
        },
        {
          field: 'age',
          operator: '>',
          value: 18
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('name={:param0} && age>{:param1}')
      expect(result.params).toEqual({ param0: 'John', param1: 18 })
    })

    it('should handle three simple filters', () => {
      const filter = createFilter([
        {
          field: 'status',
          operator: '=',
          value: 'active'
        },
        {
          field: 'created',
          operator: '>=',
          value: '2023-01-01'
        },
        {
          field: 'email',
          operator: '~',
          value: '@company.com'
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        'status={:param0} && created>={:param1} && email~{:param2}'
      )
      expect(result.params).toEqual({
        param0: 'active',
        param1: '2023-01-01',
        param2: '@company.com'
      })
    })
  })

  describe('combination filters', () => {
    it('should handle OR combination', () => {
      const filter = createFilter([
        {
          combination: '||',
          filters: [
            {
              field: 'status',
              operator: '=',
              value: 'active'
            },
            {
              field: 'status',
              operator: '=',
              value: 'pending'
            }
          ]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('(status={:param0} || status={:param1})')
      expect(result.params).toEqual({ param0: 'active', param1: 'pending' })
    })

    it('should handle AND combination', () => {
      const filter = createFilter([
        {
          combination: '&&',
          filters: [
            {
              field: 'age',
              operator: '>=',
              value: 18
            },
            {
              field: 'age',
              operator: '<=',
              value: 65
            }
          ]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('(age>={:param0} && age<={:param1})')
      expect(result.params).toEqual({ param0: 18, param1: 65 })
    })
  })

  describe('nested combinations', () => {
    it('should handle nested OR within AND', () => {
      const filter = createFilter([
        {
          field: 'verified',
          operator: '=',
          value: true
        },
        {
          combination: '||',
          filters: [
            {
              field: 'role',
              operator: '=',
              value: 'admin'
            },
            {
              field: 'role',
              operator: '=',
              value: 'moderator'
            }
          ]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        'verified={:param0} && (role={:param1} || role={:param2})'
      )
      expect(result.params).toEqual({
        param0: true,
        param1: 'admin',
        param2: 'moderator'
      })
    })

    it('should handle nested AND within OR', () => {
      const filter = createFilter([
        {
          combination: '||',
          filters: [
            {
              combination: '&&',
              filters: [
                {
                  field: 'type',
                  operator: '=',
                  value: 'premium'
                },
                {
                  field: 'active',
                  operator: '=',
                  value: true
                }
              ]
            },
            {
              field: 'type',
              operator: '=',
              value: 'admin'
            }
          ]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        '((type={:param0} && active={:param1}) || type={:param2})'
      )
      expect(result.params).toEqual({
        param0: 'premium',
        param1: true,
        param2: 'admin'
      })
    })

    it('should handle deeply nested combinations', () => {
      const filter = createFilter([
        {
          combination: '&&',
          filters: [
            {
              field: 'status',
              operator: '=',
              value: 'active'
            },
            {
              combination: '||',
              filters: [
                {
                  combination: '&&',
                  filters: [
                    {
                      field: 'age',
                      operator: '>=',
                      value: 18
                    },
                    {
                      field: 'country',
                      operator: '=',
                      value: 'US'
                    }
                  ]
                },
                {
                  field: 'special_access',
                  operator: '=',
                  value: true
                }
              ]
            }
          ]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        '(status={:param0} && ((age>={:param1} && country={:param2}) || special_access={:param3}))'
      )
      expect(result.params).toEqual({
        param0: 'active',
        param1: 18,
        param2: 'US',
        param3: true
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty filter array', () => {
      const filter = createFilter([])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('')
      expect(result.params).toEqual({})
    })

    it('should handle filter array with undefined elements', () => {
      const filter = createFilter([
        undefined,
        {
          field: 'name',
          operator: '=',
          value: 'John'
        },
        undefined
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('name={:param0}')
      expect(result.params).toEqual({ param0: 'John' })
    })

    it('should handle combination with empty filters', () => {
      const filter = createFilter([
        {
          combination: '||',
          filters: []
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('')
      expect(result.params).toEqual({})
    })

    it('should handle combination with only undefined filters', () => {
      const filter = createFilter([
        {
          combination: '&&',
          filters: [undefined, undefined]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe('')
      expect(result.params).toEqual({})
    })

    it('should handle null and undefined values', () => {
      const filter = createFilter([
        {
          field: 'nullable_field',
          operator: '=',
          value: null
        },
        {
          field: 'undefined_field',
          operator: '!=',
          value: undefined
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        'nullable_field={:param0} && undefined_field!={:param1}'
      )
      expect(result.params).toEqual({ param0: null, param1: undefined })
    })

    it('should handle various data types as values', () => {
      const filter = createFilter([
        {
          field: 'string_field',
          operator: '=',
          value: 'text'
        },
        {
          field: 'number_field',
          operator: '>',
          value: 42
        },
        {
          field: 'boolean_field',
          operator: '=',
          value: true
        },
        {
          field: 'array_field',
          operator: '~',
          value: ['item1', 'item2']
        },
        {
          field: 'object_field',
          operator: '=',
          value: { key: 'value' }
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        'string_field={:param0} && number_field>{:param1} && boolean_field={:param2} && array_field~{:param3} && object_field={:param4}'
      )
      expect(result.params).toEqual({
        param0: 'text',
        param1: 42,
        param2: true,
        param3: ['item1', 'item2'],
        param4: { key: 'value' }
      })
    })
  })

  describe('parameter counter persistence', () => {
    it('should maintain parameter counter across multiple calls', () => {
      const paramCounter = { count: 0 }

      const params = {}

      const filter1 = createFilter([
        {
          field: 'field1',
          operator: '=',
          value: 'value1'
        }
      ])

      const result1 = recursivelyBuildFilter(filter1, paramCounter, params)

      expect(result1.expression).toBe('field1={:param0}')
      expect(result1.params).toEqual({ param0: 'value1' })
      expect(paramCounter.count).toBe(1)

      const filter2 = createFilter([
        {
          field: 'field2',
          operator: '=',
          value: 'value2'
        }
      ])

      const result2 = recursivelyBuildFilter(filter2, paramCounter, params)

      expect(result2.expression).toBe('field2={:param1}')
      expect(result2.params).toEqual({ param0: 'value1', param1: 'value2' })
      expect(paramCounter.count).toBe(2)
    })
  })

  describe('all operator types', () => {
    it('should handle all comparison operators', () => {
      const operators = ['=', '!=', '>', '<', '>=', '<=', '~', '!~'] as const

      operators.forEach((operator, index) => {
        const filter = createFilter([
          {
            field: 'testField',
            operator,
            value: `value${index}`
          }
        ])

        const result = recursivelyBuildFilter(filter)

        expect(result.expression).toBe(`testField${operator}{:param0}`)
        expect(result.params).toEqual({ param0: `value${index}` })
      })
    })

    it('should handle all optional operators', () => {
      const operators = [
        '?=',
        '?!=',
        '?>',
        '?<',
        '?>=',
        '?<=',
        '?~',
        '?!~'
      ] as const

      operators.forEach((operator, index) => {
        const filter = createFilter([
          {
            field: 'testField',
            operator,
            value: `value${index}`
          }
        ])

        const result = recursivelyBuildFilter(filter)

        expect(result.expression).toBe(`testField${operator}{:param0}`)
        expect(result.params).toEqual({ param0: `value${index}` })
      })
    })
  })

  describe('real-world scenarios', () => {
    it('should handle user search with multiple criteria', () => {
      const filter = createFilter([
        {
          field: 'verified',
          operator: '=',
          value: true
        },
        {
          combination: '||',
          filters: [
            {
              field: 'name',
              operator: '~',
              value: 'John'
            },
            {
              field: 'email',
              operator: '~',
              value: 'john@'
            }
          ]
        },
        {
          field: 'created',
          operator: '>=',
          value: '2023-01-01'
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        'verified={:param0} && (name~{:param1} || email~{:param2}) && created>={:param3}'
      )
      expect(result.params).toEqual({
        param0: true,
        param1: 'John',
        param2: 'john@',
        param3: '2023-01-01'
      })
    })

    it('should handle complex permission filtering', () => {
      const filter = createFilter([
        {
          combination: '||',
          filters: [
            {
              field: 'owner',
              operator: '=',
              value: 'user123'
            },
            {
              combination: '&&',
              filters: [
                {
                  field: 'public',
                  operator: '=',
                  value: true
                },
                {
                  combination: '||',
                  filters: [
                    {
                      field: 'team_member',
                      operator: '=',
                      value: 'user123'
                    },
                    {
                      field: 'shared_with',
                      operator: '~',
                      value: 'user123'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ])

      const result = recursivelyBuildFilter(filter)

      expect(result.expression).toBe(
        '(owner={:param0} || (public={:param1} && (team_member={:param2} || shared_with~{:param3})))'
      )
      expect(result.params).toEqual({
        param0: 'user123',
        param1: true,
        param2: 'user123',
        param3: 'user123'
      })
    })
  })
})
