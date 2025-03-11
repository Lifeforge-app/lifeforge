import React from 'react'
import { useReactToPrint } from 'react-to-print'

import { Button } from '@lifeforge/ui'

function PrintAndViewButton({
  contentRef,
  showStatement,
  setShowStatement
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
  showStatement: boolean
  setShowStatement: (value: boolean) => void
}): React.ReactElement {
  const reactToPrintFn = useReactToPrint({ contentRef })

  return (
    <>
      <Button
        className="mt-4"
        icon="tabler:printer"
        onClick={() => {
          reactToPrintFn()
        }}
      >
        Print
      </Button>
      <Button
        className="mt-2"
        icon="tabler:eye"
        namespace="modules.wallet"
        variant="secondary"
        onClick={() => {
          setShowStatement(!showStatement)
        }}
      >
        {showStatement ? 'Hide Statement' : 'Show Statement'}
      </Button>
    </>
  )
}

export default PrintAndViewButton
