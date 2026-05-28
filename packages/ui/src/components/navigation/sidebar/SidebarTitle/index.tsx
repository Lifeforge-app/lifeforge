import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/inputs'
import { Flex, Text } from '@/components/primitives'

import * as styles from './SidebarTitle.css'

type SidebarTitleProps = {
  /** Label string or React element to display for the sidebar title. */
  label: string
  /** Additional CSS classes to apply to the sidebar title. */
  className?: string
  /** Action button to display on the right side of the sidebar title. */
  actionButton?:
    | React.ReactElement
    | {
        icon: string
        onClick: () => void
      }
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

/** A title for a section in the sidebar navigation. */
export function SidebarTitle({
  label,
  className,
  actionButton,
  namespace
}: SidebarTitleProps) {
  const { t } = useTranslation([namespace, 'common.sidebar'])

  return (
    <Flex
      align="center"
      as="li"
      className={styles.listItem}
      justify="between"
      pb={actionButton !== undefined ? 'sm' : 'md'}
      pl="xl"
      pt="sm"
      style={{ gap: '0.75rem', paddingRight: '1.25rem' }}
    >
      <Text
        as="h3"
        className={clsx(styles.title, className)}
        color={{ base: 'bg-400', dark: 'bg-600' }}
        size="sm"
        transform="uppercase"
        weight="semibold"
        whiteSpace="nowrap"
      >
        {t([
          `sidebar.${_.camelCase(label)}`,
          `common.sidebar:categories.${_.camelCase(label)}`,
          label
        ])}
      </Text>
      {actionButton && 'icon' in actionButton ? (
        <Text
          asChild
          color={{
            base: 'bg-400',
            hover: 'bg-800',
            dark: 'bg-500',
            darkHover: 'bg-100'
          }}
        >
          <Button
            icon={actionButton.icon}
            style={{
              padding: '0.5em'
            }}
            variant="plain"
            onClick={actionButton.onClick}
          />
        </Text>
      ) : (
        actionButton
      )}
    </Flex>
  )
}
