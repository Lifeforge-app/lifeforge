import { Icon } from '@iconify/react'
import { Card, TagChip } from 'lifeforge-ui'
import { Link } from 'react-router-dom'

import type { Module } from '@/data/modules'

interface ModuleCardProps {
  module: Module
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card
      to={`/module/${module.id}`}
      as={Link}
      isInteractive
      className="group p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="bg-custom-500/10 text-custom-500 group-hover:bg-custom-500 group-hover:text-bg-900 flex-center size-12 shrink-0 rounded-lg transition-colors duration-300">
            <Icon icon={module.icon} className="size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-bg-800 dark:text-bg-50 truncate text-xl font-semibold">
              {module.name}
            </h2>
            <p className="text-custom-500 truncate text-sm">{module.author}</p>
          </div>
        </div>
        <TagChip
          label={`v${module.version}`}
          variant="outlined"
          className="shrink-0 text-xs!"
        />
      </div>

      <p className="text-bg-500 mb-6 line-clamp-2 min-h-10">
        {module.description}
      </p>

      <div className="border-bg-200 dark:border-bg-800/50 flex-between mt-auto border-t pt-4 text-sm">
        <div className="text-bg-500 flex items-center gap-1.5">
          <Icon icon="tabler:history" className="size-4" />
          <span className="font-medium">{module.updatedAt}</span>
        </div>
        <TagChip
          label={module.category}
          variant="filled"
          className="text-xs!"
        />
      </div>
    </Card>
  )
}
