import type React from 'react'

import { Button } from '@/components/inputs'

/**
 * Nothing too fancy either, just a button saying 'Go Back'
 */
export function GoBackButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      bg={{ base: 'transparent', hover: 'transparent' }}
      icon="tabler:chevron-left"
      mb="md"
      p="sm"
      style={{
        padding: '0.5em 0.9em 0.5em 0.5em !important',
        width: 'fit-content'
      }}
      variant="plain"
      {...props}
    >
      Go Back
    </Button>
  )
}
