import { Flex, type FlexProps } from '../Flex'

export function Stack<T extends React.ElementType = 'div'>(
  props: FlexProps<T>
) {
  return (
    <Flex direction="column" gap="sm" minWidth="0" width="100%" {...props} />
  )
}
