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
}) {
  const reactToPrintFn = useReactToPrint({
    contentRef,
    bodyClass: 'print-area'
  })

  return (
    <>
      <Button
        icon="tabler:printer"
        mt="md"
        onClick={() => {
          reactToPrintFn()
        }}
      >
        Print
      </Button>
      <Button
        icon="tabler:eye"
        mt="sm"
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
