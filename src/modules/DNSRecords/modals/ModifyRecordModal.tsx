// import React, { useReducer, useState } from 'react'
// import Input from '@lifeforge/uiAndInputs/Input'
// import Modal from '@lifeforge/ui'
// import ModalHeader from '@lifeforge/ui'
// import { type DNSRecordType } from '@interfaces/dns_records_interfaces'

// interface IRecord {
//   dname: string
//   ttl: number
//   record_type: typeof DNSRecordType
//   data: []
// }

// function ModifyRecordModal({
//   openType,
//   setOpenType
// }: {
//   openType: string
//   setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
// }): React.ReactElement {
//   const [data, setData] = useReducer(
//     (state, newState) => ({ ...state, ...newState }),
//     {
//       name: '',
//       type: 'A',
//       value: [],
//       ttl: 3600
//     }
//   )

//   function updateValue(key: string, value: string): void {
//     setData({ [key]: value })
//   }

//   return (
//     <Modal isOpen={openType !== null}>
//       <ModalHeader
//         icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
//         title={`${openType === 'create' ? 'Create' : 'Update'} Record`}
//         onClose={() => {
//           setOpenType(null)
//         }}
//       />
//       <Input
//         icon="tabler:file"
//         value={data.name}
//         updateValue={name => {
//           updateValue('name', name)
//         }}
//       />
//     </Modal>
//   )
// }

// export default ModifyRecordModal
