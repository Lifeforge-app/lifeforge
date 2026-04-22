import { Icon } from '@iconify/react'
import { useCallback, useState } from 'react'

import { GoBackButton } from '@components/navigation'
import { ModalHeader } from '@components/overlays'
import { Box, Flex, Text, Transition } from '@components/primitives'

import IconSet from './pages/IconSet'
import IconSetList from './pages/IconSetList/index'
import SearchResult from './pages/SearchResult'

function IconPickerModal({
  data: { setSelectedIcon },
  onClose
}: {
  data: {
    setSelectedIcon: (icon: string) => void
  }
  onClose: () => void
}) {
  const [currentIconSet, setCurrentIconSet] = useState<{
    iconSet?: string
    search?: string
  } | null>(null)

  const handleIconSelected = useCallback((icon: string) => {
    setSelectedIcon(icon)
    onClose()
  }, [])

  function renderContent() {
    if (currentIconSet === null) {
      return <IconSetList setCurrentIconSet={setCurrentIconSet} />
    }

    if (currentIconSet.search !== undefined) {
      return (
        <SearchResult
          searchTerm={currentIconSet.search}
          setCurrentIconSetProp={setCurrentIconSet}
          onIconSelected={handleIconSelected}
        />
      )
    }

    return (
      <IconSet
        iconSet={currentIconSet.iconSet ?? ''}
        onIconSelected={handleIconSelected}
      />
    )
  }

  return (
    <Flex
      direction="column"
      flexShrink="1"
      minHeight="80vh"
      minWidth={{ base: 'none', sm: '70vw' }}
    >
      {currentIconSet !== null ? (
        <Flex align="center" justify="between" mb="xl" width="100%">
          <GoBackButton onClick={() => setCurrentIconSet(null)} />
          <Transition>
            <Box
              asChild
              bg={{ base: 'transparent', hover: 'bg-100', darkHover: 'bg-800' }}
              p="sm"
              rounded="md"
            >
              <Text
                asChild
                color={{ base: 'bg-500', hover: 'bg-800', darkHover: 'bg-50' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIconSet(null)
                    setSelectedIcon('')
                    onClose()
                  }}
                >
                  <Icon
                    icon="tabler:x"
                    style={{ height: '1.5rem', width: '1.5rem' }}
                  />
                </button>
              </Text>
            </Box>
          </Transition>
        </Flex>
      ) : (
        <ModalHeader
          appendTitle={
            <Text
              align="right"
              color="bg-500"
              size={{ base: 'sm', sm: 'base' }}
            >
              powered by&nbsp;
              <Text asChild decoration="underline">
                <a
                  href="https://iconify.design"
                  rel="noreferrer"
                  target="_blank"
                >
                  Iconify
                </a>
              </Text>
            </Text>
          }
          icon="tabler:icons"
          title="iconPicker.title"
          onClose={onClose}
        />
      )}
      {renderContent()}
    </Flex>
  )
}

export default IconPickerModal
