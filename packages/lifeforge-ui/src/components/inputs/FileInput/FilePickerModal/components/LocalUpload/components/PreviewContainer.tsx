import { Icon } from '@iconify/react'
import { useMemo } from 'react'

import { Button } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

import { FILE_ICONS } from '../../../constants/file_icons'

export function PreviewContainer({
  preview,
  setPreview,
  file,
  setFile,
  fileName,
  onRemove
}: {
  preview: string | null
  setPreview: (preview: string | null) => void
  file: File | string | null
  setFile: (file: File | null) => void
  fileName?: string
  onRemove?: () => void
}) {
  const finalFileName = useMemo(() => {
    if (fileName) return fileName
    if (typeof file === 'string') return file.split('/').pop()
    if (file instanceof File) return file.name

    return undefined
  }, [file, fileName])

  return (
    <Flex
      align="center"
      justify="center"
      minWidth="0"
      style={{ flex: 1 }}
      width="100%"
    >
      {preview !== null && (
        <Flex
          shadow
          bg={{ base: 'bg-200', dark: 'bg-800' }}
          direction="column"
          minWidth="0"
          overflow="hidden"
          p="md"
          position="relative"
          rounded="lg"
          style={{ minHeight: '8rem' }}
          width="100%"
        >
          <Flex align="center" justify="between" mb="lg" ml="md">
            <Flex
              align="center"
              minWidth="0"
              style={{ gap: '0.75rem' }}
              width="100%"
            >
              <Text
                asChild
                color="bg-500"
                style={{ height: '1.5rem', width: '1.5rem', flexShrink: 0 }}
              >
                <Icon
                  icon={
                    FILE_ICONS[
                      finalFileName?.split('.').pop() as keyof typeof FILE_ICONS
                    ] || 'tabler:file'
                  }
                />
              </Text>
              <Text truncate as="p" style={{ width: '100%' }}>
                {finalFileName}
              </Text>
            </Flex>
            <Button
              icon="tabler:x"
              variant="plain"
              onClick={() => {
                setPreview(null)
                setFile(null)
                onRemove?.()
              }}
            />
          </Flex>
          <Box
            asChild
            rounded="md"
            style={{ maxHeight: '24rem', objectFit: 'contain' }}
          >
            <img alt="" src={preview} />
          </Box>
        </Flex>
      )}
      {file !== null && preview === null && (
        <Flex
          align="center"
          justify="between"
          mb="lg"
          minWidth="0"
          style={{ gap: '2rem' }}
          width="100%"
        >
          <Flex
            align="center"
            minWidth="0"
            style={{ gap: '0.75rem' }}
            width="100%"
          >
            <Text
              asChild
              color="bg-500"
              style={{ height: '1.5rem', width: '1.5rem' }}
            >
              <Icon
                icon={
                  FILE_ICONS[
                    finalFileName?.split('.').pop() as keyof typeof FILE_ICONS
                  ] || 'tabler:file'
                }
              />
            </Text>
            <Text truncate as="p">
              {finalFileName}
            </Text>
          </Flex>
          <Button
            icon="tabler:x"
            style={{ padding: '0.5rem' }}
            variant="plain"
            onClick={() => {
              setPreview(null)
              setFile(null)
              onRemove?.()
            }}
          />
        </Flex>
      )}
    </Flex>
  )
}

