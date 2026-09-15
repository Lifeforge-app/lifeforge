import { Flex, Icon, Text, Transition } from '@lifeforge/ui'

export default function RightBarBottomLink({
  to,
  children
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Transition>
      <Flex asChild align="center" gap="sm" mt="lg">
        <Text
          as="a"
          color={{
            base: 'bg-600',
            dark: 'bg-400',
            hover: 'bg-900',
            darkHover: 'bg-100'
          }}
          href={to}
          rel="noreferrer"
          target="_blank"
          weight="medium"
        >
          {children}
          <Icon
            icon="tabler:arrow-up-right"
            style={{
              marginBottom: '-0.25em'
            }}
          />
        </Text>
      </Flex>
    </Transition>
  )
}
