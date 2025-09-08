import { Button } from 'lifeforge-ui'
import { useReactToPrint } from 'react-to-print'

function PrintAndViewButton({
  contentRef,
  showStatement,
  setShowStatement
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
  showStatement: boolean
  setShowStatement: (value: boolean) => void
}) {
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
        namespace="apps.wallet"
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
