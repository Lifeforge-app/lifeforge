import { Box, Text } from '@components/primitives'

export function VariantContainer({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Box>
      <Text as="code" color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
        {title}
      </Text>
      <Box mt="sm">{children}</Box>
    </Box>
  )
}
