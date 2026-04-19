import { Icon } from '@iconify/react'
import type { StoryObj, Meta as _Meta } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

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
      <div className="w-full px-32">
        <SearchInput {...args} value={value} onChange={onChange} />
      </div>
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
    <div className="w-full px-32">
      <SearchInput {...args} />
    </div>
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
      <div className="w-full px-32">
        <SearchInput {...args} value={value} onChange={onChange} />
      </div>
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
    <div
      key={product.id}
      className="hover:bg-bg-100 dark:hover:bg-bg-800 flex cursor-pointer items-center gap-4 rounded-md px-4 py-3 transition-all"
      onClick={() => alert(`Selected product: ${product.title}`)}
    >
      <img
        alt={product.title}
        className="size-12 shrink-0 rounded-md object-cover"
        src={product.thumbnail}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-bg-500 text-sm">{product.category}</span>
        <span className="truncate font-medium">{product.title}</span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <span className="text-custom-500 font-semibold">
            $
            {(product.price * (1 - product.discountPercentage / 100)).toFixed(
              2
            )}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-bg-500 text-sm line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-bg-500 flex items-center gap-1 text-sm">
          <Icon className="size-4" icon="tabler:star" />
          {product.rating.toFixed(1)}
        </div>
      </div>
    </div>
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
      <div className="h-128 w-full px-32">
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
                  <div className="text-bg-500 px-4 py-3 text-center">
                    No suggestions found.
                  </div>
                )}
              </>
            )}
          </WithQuery>
        </SearchInput>
      </div>
    )
  }
}
