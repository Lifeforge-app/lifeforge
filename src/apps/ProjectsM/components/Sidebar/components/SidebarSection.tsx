import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

import { useProjectsMContext } from '../../../providers/ProjectsMProvider'
import SidebarItem from './SidebarItem'

function SidebarSection({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}) {
  const { t } = useTranslation('apps.projectsM')
  const { dataQuery, setExistedData, setModifyDataModalOpenType } =
    useProjectsMContext()[stuff]

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyDataModalOpenType('create')
        }}
        name={stuff}
        namespace="apps.projectsM"
      />
      <QueryWrapper query={dataQuery}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem key={item.id} item={item} stuff={stuff} />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">{t(`empty.${stuff}`)}</p>
          )
        }
      </QueryWrapper>
    </>
  )
}

export default SidebarSection
