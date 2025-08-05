import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ModalHeader, QueryWrapper } from 'lifeforge-ui'
import React from 'react'

function ManageTemplatesModal({ onClose }: { onClose: () => void }) {
  const transactionTemplatesQuery = useQuery(
    forgeAPI.wallet.templates.list.queryOptions()
  )

  return (
    <>
      <ModalHeader
        icon="tabler:template"
        namespace="apps.wallet"
        title="Manage Templates"
        onClose={onClose}
      />
      <QueryWrapper query={transactionTemplatesQuery}>
        {templates => (
            
        )}
      </QueryWrapper>
    </>
  )
}

export default ManageTemplatesModal
