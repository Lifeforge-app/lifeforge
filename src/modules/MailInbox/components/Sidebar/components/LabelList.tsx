import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { Loadable } from '@interfaces/common'
import { IMailInboxLabel } from '@interfaces/mail_inbox_interfaces'

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
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div key={label.label.id} className={level > 0 ? 'pl-6' : ''}>
      <SidebarItem
        icon="tabler:tag"
        name={label.label.name}
        needTranslate={false}
        onCollapseButtonClick={
          label.children.length > 0 ? () => setCollapsed(!collapsed) : undefined
        }
        number={label.label.count}
        showCollapseSpacer={level > 0}
        isCollapsed={collapsed}
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
        active={searchParams.get('label') === label.label.id}
        onClick={() => {
          setSearchParams({ ...searchParams, label: label.label.id })
        }}
        onCancelButtonClick={() => {
          const newParams = new URLSearchParams(searchParams)
          newParams.delete('label')
          setSearchParams(newParams)
        }}
      />
      <div className={`overflow-hidden ${collapsed ? 'h-0' : 'h-auto'}`}>
        {label.children.length > 0 && (
          <LabelList
            key={label.label.id}
            list={label.children}
            level={level + 1}
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
}): React.ReactElement {
  return (
    <div>
      {list.map(label => (
        <LabelChildList key={label.label.id} label={label} level={level} />
      ))}
    </div>
  )
}

function MasterLabelList({
  labels
}: {
  labels: Loadable<IMailInboxLabel[]>
}): React.ReactElement {
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
