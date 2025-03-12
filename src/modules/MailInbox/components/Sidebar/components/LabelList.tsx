import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { APIFallbackComponent, MenuItem, SidebarItem } from '@lifeforge/ui'

import { IMailInboxLabel } from '@modules/MailInbox/interfaces/mail_inbox_interfaces'

import { Loadable } from '../../../../../core/interfaces/common'

interface ILabelListStructure {
  label: IMailInboxLabel
  children: ILabelListStructure[]
}

function getFullPath(record: IMailInboxLabel, allRecords: IMailInboxLabel[]) {
  let path = record.id
  let parent = record.parent

  while (parent) {
    const parentRecord = allRecords.find(r => r.id === parent)
    if (!parentRecord) break

    path = `${parentRecord.id}/${path}`
    parent = parentRecord.parent
  }

  return path
}

function getLabelFullName(labels: IMailInboxLabel[]): string[] {
  const allNames = []
  for (const record of labels) {
    allNames.push(getFullPath(record, labels))
  }

  return allNames
}

function constructLabelListRecursively(
  labels: IMailInboxLabel[]
): ILabelListStructure[] {
  const allLabels = getLabelFullName(labels)
  const labelList: ILabelListStructure[] = []

  for (const label of allLabels) {
    const splitted = label.split('/')

    for (let i = 0; i < splitted.length; i++) {
      let currentLevel = labelList
      const parents = splitted.slice(0, i)
      for (const parent of parents) {
        const parentLevel = currentLevel.find(l => l.label.id === parent)
        if (parentLevel) {
          currentLevel = parentLevel.children
        } else {
          const newParent: ILabelListStructure = {
            label: labels.find(l => l.id === parent)!,
            children: []
          }
          currentLevel.push(newParent)
          currentLevel = newParent.children
        }
      }

      const currentLabel = splitted[i]
      const currentLabelLevel = currentLevel.find(
        l => l.label.id === currentLabel
      )
      if (!currentLabelLevel) {
        const newLabel: ILabelListStructure = {
          label: labels.find(l => l.id === currentLabel)!,
          children: []
        }
        currentLevel.push(newLabel)
      }
    }
  }

  return labelList
}

function LabelChildList({
  label,
  level = 0
}: {
  label: ILabelListStructure
  level?: number
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div key={label.label.id} className={level > 0 ? 'pl-6' : ''}>
      <SidebarItem
        active={searchParams.get('label') === label.label.id}
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={() => {
                console.log('Edit')
              }}
            />
          </>
        }
        icon="tabler:tag"
        isCollapsed={collapsed}
        name={label.label.name}
        needTranslate={false}
        number={label.label.count}
        showCollapseSpacer={level > 0}
        onCancelButtonClick={() => {
          const newParams = new URLSearchParams(searchParams)
          newParams.delete('label')
          setSearchParams(newParams)
        }}
        onClick={() => {
          setSearchParams({ ...searchParams, label: label.label.id })
        }}
        onCollapseButtonClick={
          label.children.length > 0 ? () => setCollapsed(!collapsed) : undefined
        }
      />
      <div className={clsx('overflow-hidden', collapsed ? 'h-0' : 'h-auto')}>
        {label.children.length > 0 && (
          <LabelList
            key={label.label.id}
            level={level + 1}
            list={label.children}
          />
        )}
      </div>
    </div>
  )
}

function LabelList({
  list,
  level = 0
}: {
  list: ILabelListStructure[]
  level?: number
}) {
  return (
    <div>
      {list.map(label => (
        <LabelChildList key={label.label.id} label={label} level={level} />
      ))}
    </div>
  )
}

function MasterLabelList({ labels }: { labels: Loadable<IMailInboxLabel[]> }) {
  const [labelList, setLabelList] =
    useState<Loadable<ILabelListStructure[]>>('loading')

  useEffect(() => {
    if (typeof labels === 'string') {
      setLabelList(labels)
    } else {
      setLabelList(
        constructLabelListRecursively(
          labels.filter(
            e =>
              ![
                'INBOX',
                'Trash',
                'Unwanted',
                'Sent',
                'Important',
                'Starred'
              ].includes(e.name)
          )
        )
      )
    }
  }, [labels])

  return (
    <APIFallbackComponent data={labelList}>
      {labelList => <LabelList list={labelList} />}
    </APIFallbackComponent>
  )
}

export default MasterLabelList
