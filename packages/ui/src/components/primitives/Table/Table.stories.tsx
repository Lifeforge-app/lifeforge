import type { Meta, StoryObj } from '@storybook/react-vite'

import { Flex, Text } from '@/components/primitives'
import { ScrollableStory } from '@/storybook/ScrollableStory'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow
} from './index'

const meta = {
  argTypes: {
    bg: { control: false },
    children: { control: false }
  },
  component: Table,
  title: 'Primitives/Table'
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

const ACCOUNTS = [
  {
    category: 'Cash',
    change: '+14.11%',
    current: '14,150.00',
    id: 'cash',
    name: 'Wallet',
    previous: '12,400.00'
  },
  {
    category: 'Bank',
    change: '+3.42%',
    current: '38,720.00',
    id: 'bank',
    name: 'Savings account',
    previous: '37,440.00'
  },
  {
    category: 'Investment',
    change: '-2.08%',
    current: '21,930.00',
    id: 'investment',
    name: 'Index fund',
    previous: '22,395.00'
  },
  {
    category: 'Liability',
    change: '-5.60%',
    current: '4,720.00',
    id: 'loan',
    name: 'Car loan',
    previous: '5,000.00'
  }
]

function AccountRows({ highlightedId }: { highlightedId?: string }) {
  return (
    <TableBody>
      {ACCOUNTS.map(account => (
        <TableRow
          key={account.id}
          bg={
            account.id === highlightedId
              ? { base: 'bg-200', dark: 'bg-800' }
              : undefined
          }
        >
          <TableCell>{account.name}</TableCell>
          <TableCell>{account.category}</TableCell>
          <TableCell align="right">{account.previous}</TableCell>
          <TableCell align="right">{account.current}</TableCell>
          <TableCell
            align="right"
            color={account.change.startsWith('-') ? 'rose-600' : undefined}
          >
            {account.change}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export const Default: Story = {
  render: args => (
    <Table {...args} width="100%">
      <TableHeader>
        <TableRow>
          <TableHeaderCell align="left">Account</TableHeaderCell>
          <TableHeaderCell>Category</TableHeaderCell>
          <TableHeaderCell>Previous</TableHeaderCell>
          <TableHeaderCell>Current</TableHeaderCell>
          <TableHeaderCell>Change</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <AccountRows />
      <TableCaption>Balances for the current statement period.</TableCaption>
    </Table>
  )
}

export const CustomRowBackground: Story = {
  render: () => (
    <Table width="100%">
      <TableHeader>
        <TableRow>
          <TableHeaderCell align="left">Account</TableHeaderCell>
          <TableHeaderCell>Category</TableHeaderCell>
          <TableHeaderCell>Previous</TableHeaderCell>
          <TableHeaderCell>Current</TableHeaderCell>
          <TableHeaderCell>Change</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <AccountRows highlightedId="investment" />
      <TableCaption>
        A row with a bg prop opts out of the striped background.
      </TableCaption>
    </Table>
  )
}

export const CustomHeaderAndTotals: Story = {
  render: () => (
    <Table width="100%">
      <TableHeader>
        <TableRow bg="custom-500" color="bg-50">
          <TableHeaderCell align="left" width="100%">
            Account
          </TableHeaderCell>
          <TableHeaderCell>Previous</TableHeaderCell>
          <TableHeaderCell>Current</TableHeaderCell>
          <TableHeaderCell>Change</TableHeaderCell>
        </TableRow>
        <TableRow bg="bg-800" color="bg-50">
          <TableHeaderCell align="left" width="100%" />
          <TableHeaderCell>RM</TableHeaderCell>
          <TableHeaderCell>RM</TableHeaderCell>
          <TableHeaderCell>%</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ACCOUNTS.map(account => (
          <TableRow key={account.id}>
            <TableCell>
              <Flex align="center" gap="sm">
                <Text whiteSpace="nowrap">{account.name}</Text>
              </Flex>
            </TableCell>
            <TableCell nowrap align="right">
              {account.previous}
            </TableCell>
            <TableCell nowrap align="right">
              {account.current}
            </TableCell>
            <TableCell
              nowrap
              align="right"
              color={account.change.startsWith('-') ? 'rose-600' : undefined}
            >
              {account.change}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            <Text size="xl" weight="semibold">
              Net worth
            </Text>
          </TableCell>
          <TableCell nowrap align="right" variant="total">
            77,530.00
          </TableCell>
          <TableCell nowrap align="right" variant="total">
            75,080.00
          </TableCell>
          <TableCell nowrap align="right" variant="total">
            +3.26%
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export const Scrollable: Story = {
  render: () => (
    <ScrollableStory>
      <Table width="max-content">
        <TableHeader>
          <TableRow>
            {[
              'Flight',
              'Status',
              'Scheduled',
              'Estimated',
              'Airline',
              'Origin',
              'Destination',
              'Terminal',
              'Gate'
            ].map(column => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            [
              'SQ 123',
              'On time',
              '08:00',
              '08:00',
              'Singapore Airlines',
              'Singapore',
              'Kuala Lumpur',
              'T2',
              'A12'
            ],
            [
              'MH 604',
              'Delayed',
              '09:15',
              '09:40',
              'Malaysia Airlines',
              'Kuala Lumpur',
              'Singapore',
              'T1',
              'B04'
            ],
            [
              'CX 712',
              'Boarding',
              '10:05',
              '10:05',
              'Cathay Pacific',
              'Hong Kong',
              'Singapore',
              'T4',
              'G18'
            ]
          ].map(
            ([
              flight,
              status,
              scheduled,
              estimated,
              airline,
              origin,
              destination,
              terminal,
              gate
            ]) => (
              <TableRow key={flight}>
                <TableCell align="center">{flight}</TableCell>
                <TableCell align="center">{status}</TableCell>
                <TableCell align="center">{scheduled}</TableCell>
                <TableCell align="center">{estimated}</TableCell>
                <TableCell>{airline}</TableCell>
                <TableCell>{origin}</TableCell>
                <TableCell>{destination}</TableCell>
                <TableCell align="center">{terminal}</TableCell>
                <TableCell align="center">{gate}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </ScrollableStory>
  )
}
