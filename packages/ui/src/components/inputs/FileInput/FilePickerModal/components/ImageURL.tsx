import { TextInput } from '@/components/inputs'
import { Icon } from '@/components/primitives'
import { Box, Text } from '@/components/primitives'

export function ImageURL({
  file,
  setFile,
  setPreview
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
}) {
  return (
    <>
      <TextInput
        icon="tabler:link"
        label="imagePicker.inputs.imageLink"
        namespace="common.modals"
        placeholder="https://example.com/image.jpg"
        value={file === null ? '' : (file as string)}
        onChange={(value: string) => {
          setFile(value)
          setPreview(value)
        }}
      />

      <Box
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        mt="md"
        overflow="hidden"
        position="relative"
        rounded="md"
        style={{ flex: 1, isolation: 'isolate', minHeight: 0 }}
      >
        <Box asChild style={{ height: '100%', objectFit: 'contain' }}>
          <img alt="" src={file as string} />
        </Box>
        <Text
          asChild
          color={{ base: 'bg-300', dark: 'bg-700' }}
          style={{
            height: '8rem',
            left: '50%',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8rem',
            zIndex: -1
          }}
        >
          <Icon icon="tabler:photo" />
        </Text>
      </Box>
    </>
  )
}
