import { Icon } from '@iconify/react'
import type { StoryObj, Meta as _Meta } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Box, Flex, Text } from '@components/primitives'
import { WithQuery } from '@components/utilities'

import SearchInput from './SearchInput'

const meta = {
  component: SearchInput
} satisfies _Meta<typeof SearchInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    searchTarget: 'something'
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <Box style={{ paddingLeft: '8rem', paddingRight: '8rem' }} width="100%">
        <SearchInput {...args} value={value} onChange={onChange} />
      </Box>
    )
  }
}

/**
 * SearchInput component with a custom icon.
 */
export const CustomIcon: Story = {
  args: {
    value: '',
    onChange: () => {},
    searchTarget: 'something',
    icon: 'tabler:cube'
  },

  render: args => (
    <Box style={{ paddingLeft: '8rem', paddingRight: '8rem' }} width="100%">
      <SearchInput {...args} />
    </Box>
  )
}

/**
 * SearchInput component with an action button at the right end.
 */
export const WithActionButton: Story = {
  args: {
    value: '',
    onChange: () => {},
    searchTarget: 'something',
    actionButtonProps: {
      variant: 'plain',
      onClick: () => {},
      icon: 'tabler:filter'
    }
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <Box style={{ paddingLeft: '8rem', paddingRight: '8rem' }} width="100%">
        <SearchInput {...args} value={value} onChange={onChange} />
      </Box>
    )
  }
}

export interface ProductElement {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: Meta
  images: string[]
  thumbnail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Meta {
  createdAt: Date
  updatedAt: Date
  barcode: string
  qrCode: string
}

export interface Review {
  rating: number
  comment: string
  date: Date
  reviewerName: string
  reviewerEmail: string
}

const ProductSuggestionItem = ({ product }: { product: ProductElement }) => {
  return (
    <Flex
      align="center"
      bg={{ darkHover: 'bg-800', hover: 'bg-100' }}
      gap="md"
      px="md"
      rounded="md"
      style={{
        cursor: 'pointer',
        paddingBottom: '0.75rem',
        paddingTop: '0.75rem',
        transition: 'all 0.2s'
      }}
      onClick={() => alert(`Selected product: ${product.title}`)}
    >
      <img
        alt={product.title}
        src={product.thumbnail}
        style={{
          borderRadius: 'var(--radius-md)',
          flexShrink: 0,
          height: '3rem',
          objectFit: 'cover',
          width: '3rem'
        }}
      />
      <Flex direction="column" flexGrow="1" minWidth="0">
        <Text color="bg-500" size="sm">
          {product.category}
        </Text>
        <Text truncate weight="medium">
          {product.title}
        </Text>
      </Flex>
      <Flex
        align="end"
        direction="column"
        flexShrink="0"
        style={{ gap: '0.25rem' }}
      >
        <Flex align="center" style={{ gap: '0.25rem' }}>
          <Text color="primary" weight="semibold">
            $
            {(product.price * (1 - product.discountPercentage / 100)).toFixed(
              2
            )}
          </Text>
          {product.discountPercentage > 0 && (
            <Text color="bg-500" decoration="line-through" size="sm">
              ${product.price.toFixed(2)}
            </Text>
          )}
        </Flex>
        <Text asChild color="bg-500" size="sm">
          <Flex align="center" style={{ gap: '0.25rem' }}>
            <Icon
              icon="tabler:star"
              style={{ height: '1rem', width: '1rem' }}
            />
            {product.rating.toFixed(1)}
          </Flex>
        </Text>
      </Flex>
    </Flex>
  )
}

export const WithSearchSuggestions: Story = {
  args: {
    value: '',
    onChange: () => {},
    searchTarget: 'something'
  },
  parameters: {
    docs: {
      source: {
        code: `
// This is just an example. Replace the fetch URL and the search result component design as needed.

import { useQuery } from '@tanstack/react-query'
import SearchInput from './SearchInput'

function ProductSuggestionItem({ product }) {
  // ... define the ProductSuggestionItem component here
}

function SearchWithSuggestions() {
  const [value, onChange] = useState('')

  const productQuery = useQuery({
    queryKey: ['search-suggestions', value],
    queryFn: async () => {
      const res = await fetch(
        'https://dummyjson.com/products/search?q=' + value
      )

      const data = await res.json()

      return data.products.slice(0, 5)
    },
    enabled: value.length > 0
  })

  return (
    <SearchInput
      debounceMs={300}
      showChildrenPolicy="query-not-empty"
      value={value}
      onChange={onChange}
    >
      <WithQuery query={productQuery}>
        {products => (
          <>
            {products.length > 0 ? (
              productQuery.data?.map(product => (
                <ProductSuggestionItem key={product.id} product={product} />
              ))
            ) : (
              <div className="text-bg-500 px-4 py-3 text-center">
                No suggestions found.
              </div>
            )}
          </>
        )}
      </WithQuery>
    </SearchInput>
  )
}
        `.trim()
      }
    }
  },
  render: args => {
    const [value, onChange] = useState('')

    // Replace with actual API call for search suggestions
    const productQuery = useQuery({
      queryKey: ['search-suggestions', value],
      queryFn: async () => {
        const res = await fetch(
          'https://dummyjson.com/products/search?q=' + value
        )

        const data = await res.json()

        return data.products.slice(0, 5) as ProductElement[]
      },
      enabled: value.length > 0
    })

    return (
      <Box
        style={{ height: '32rem', paddingLeft: '8rem', paddingRight: '8rem' }}
        width="100%"
      >
        <SearchInput
          {...args}
          debounceMs={300}
          showChildrenPolicy="query-not-empty"
          value={value}
          onChange={onChange}
        >
          <WithQuery query={productQuery}>
            {products => (
              <>
                {products.length > 0 ? (
                  productQuery.data?.map(product => (
                    <ProductSuggestionItem key={product.id} product={product} />
                  ))
                ) : (
                  <Text
                    align="center"
                    as="div"
                    color="bg-500"
                    px="md"
                    style={{ paddingBottom: '0.75rem', paddingTop: '0.75rem' }}
                  >
                    No suggestions found.
                  </Text>
                )}
              </>
            )}
          </WithQuery>
        </SearchInput>
      </Box>
    )
  }
}
