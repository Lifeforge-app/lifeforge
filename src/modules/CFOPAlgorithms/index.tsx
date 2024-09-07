import React from 'react'
import { Link } from 'react-router-dom'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'

function CFOPAlgorithms(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:cube" title="CFOP Algorithms" desc="..." />
      <div className="mt-8 grid grid-cols-3 gap-6">
        {Object.entries({
          F2L: 'First Two Layers',
          OLL: 'Orientation of the Last Layer',
          PLL: 'Permutation of the Last Layer'
        }).map(([key, value]) => (
          <Link
            key={key}
            to={`/cfop-algorithms/${key.toLowerCase()}`}
            className="flex flex-col items-center justify-center rounded-md bg-bg-50 p-4 shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70"
          >
            <img
              src={`/assets/cfop/landing-${key.toLowerCase()}.webp`}
              alt={key}
              className="mb-8 size-48"
            />
            <h2 className="text-5xl font-semibold tracking-wider">{key}</h2>
            <p className="mt-2 text-xl">{value}</p>
          </Link>
        ))}
      </div>
    </ModuleWrapper>
  )
}

export default CFOPAlgorithms
