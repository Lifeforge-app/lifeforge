/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { Icon } from '@iconify/react'
import React from 'react'
// import { useNavigate, useParams } from 'react-router'
// import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
// import ModuleWrapper from '@components/Module/ModuleWrapper'
// import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
// import FILE_ICONS from '@constants/file_icons'
// import useFetch from '@hooks/useFetch'
// import { type INotesEntry } from '@interfaces/notes_interfaces'

function NotesFile(): React.ReactElement {
  // const { id } = useParams<{ id: string }>()
  // const [entry] = useFetch<INotesEntry>(`notes/entries/get/${id}`)
  // const navigate = useNavigate()

  return (
    <></>
    // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
    //   <ModuleWrapper>
    //     <APIComponentWithFallback data={entry}>
    //       <GoBackButton
    //         onClick={() => {
    //           navigate(-1)
    //         }}
    //       />
    //       {typeof entry !== 'string' && (
    //         <>
    //           <div className="relative z-[100] mb-8 flex w-full flex-between gap-4 sm:gap-12">
    //             <div className="flex items-center gap-4">
    //               <div className="relative rounded-lg p-3">
    //                 <Icon
    //                   icon={
    //                     FILE_ICONS[
    //                       entry.name
    //                         ?.split('.')
    //                         .pop() as keyof typeof FILE_ICONS
    //                     ] ?? 'tabler:file'
    //                   }
    //                   className="text-2xl text-custom-500 sm:text-3xl"
    //                 />
    //                 <div className="absolute left-0 top-0 size-full rounded-lg bg-custom-500 opacity-20" />
    //               </div>
    //               <h1 className="w-full truncate text-2xl font-semibold">
    //                 {entry.name}
    //               </h1>
    //             </div>
    //             <div className="flex items-center gap-4">
    //               <button className="hidden rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-100 md:block">
    //                 <Icon icon="tabler:download" className="text-2xl" />
    //               </button>
    //               <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
    //                 <Icon
    //                   icon="tabler:dots-vertical"
    //                   className="text-xl sm:text-2xl"
    //                 />
    //               </button>
    //             </div>
    //           </div>
    //           <div className="mb-8 w-full flex-1 overflow-hidden rounded-lg">
    //             {entry.file.split('.').pop() === 'pdf' && (
    //               <Viewer
    //                 theme="dark"
    //                 fileUrl={`${import.meta.env.VITE_API_HOST}/media/${
    //                   entry.collectionId
    //                 }/${entry.id}/${entry.file}`}
    //               />
    //             )}
    //           </div>
    //         </>
    //       )}
    //     </APIComponentWithFallback>
    //   </ModuleWrapper>
    // </Worker>
  )
}

export default NotesFile
