import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Button, Card, Tabs, TagChip } from 'lifeforge-ui'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { MODULES } from '@/data/modules'

export default function ModuleDetail() {
  const { id } = useParams()
  const module = MODULES.find(m => m.id === id)
  const [activeTab, setActiveTab] = useState('readme')

  if (!module) {
    return (
      <div className="py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold">Module not found</h2>
        <Link to="/registry" className="btn btn-custom-500">
          Go back to Registry
        </Link>
      </div>
    )
  }

  const installCommand = `bun forge modules install ${module.id}`

  return (
    <div className="mt-8 min-h-full">
      <div className="mb-12 flex flex-col items-start gap-8 md:flex-row">
        <div className="bg-custom-500/10 text-custom-500 grid size-20 shrink-0 place-items-center rounded-xl">
          <Icon icon={module.icon} className="size-12" />
        </div>
        <div className="flex-1">
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-4xl font-bold">{module.name}</h1>
              <div className="text-bg-500 flex items-center gap-2 font-mono text-sm">
                <span className="component-bg rounded px-2 py-1">
                  {module.id}
                </span>
                <span>•</span>
                <span>v{module.version}</span>
              </div>
            </div>
          </div>

          <p className="text-bg-600 dark:text-bg-400 mb-6 max-w-2xl text-lg">
            {module.description}
          </p>

          <div className="text-bg-500 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon icon="tabler:user" className="size-5" />
              <span>{module.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <Icon icon="tabler:calendar" className="size-5" />
              <span>Updated {module.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>
      <Card className="component-bg mb-12 p-4 pt-12 text-lg">
        <div className="absolute top-6 left-6 flex gap-2">
          {['bg-red-500', 'bg-amber-500', 'bg-green-500'].map(color => (
            <span
              key={color}
              className={`block size-3 rounded-full ${color}`}
            />
          ))}
        </div>
        <pre className="text-bg-600 dark:text-bg-400 flex">
          <code className="flex-center w-full flex-1 text-center">
            <span className="text-custom-500">$</span> {installCommand}
          </code>
          <Button
            variant="plain"
            icon="tabler:copy"
            onClick={() => navigator.clipboard.writeText(installCommand)}
            title="Copy to clipboard"
          />
        </pre>
      </Card>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs
            items={[
              {
                id: 'readme',
                name: 'README',
                icon: 'tabler:file-text'
              },
              {
                id: 'changelog',
                name: 'Changelog',
                icon: 'tabler:history'
              },
              {
                id: 'license',
                name: 'License',
                icon: 'tabler:license'
              }
            ]}
            currentTab={activeTab}
            onTabChange={setActiveTab}
            enabled={['readme', 'changelog', 'license']}
          />

          <div className="prose prose-base max-w-none pt-4">
            {activeTab === 'readme' && (
              <>
                <h2>About this module</h2>
                <p>
                  This is a dummy README content for{' '}
                  <strong>{module.name}</strong>. In the real implementation,
                  this would be fetched from the module's <code>README.md</code>{' '}
                  file in the registry.
                </p>
                <h3>Features</h3>
                <ul>
                  <li>Feature 1: Something amazing</li>
                  <li>Feature 2: Another cool thing</li>
                  <li>Feature 3: Works with LifeForge ecosystem</li>
                </ul>
                <h3>Installation</h3>
                <p>
                  Run the install command provided above to add this module to
                  your LifeForge instance.
                </p>
              </>
            )}
            {activeTab === 'changelog' && (
              <>
                <h3>Version {module.version}</h3>
                <ul>
                  <li>Initial release to public registry</li>
                  <li>Bug fixes and performance improvements</li>
                </ul>
              </>
            )}
            {activeTab === 'license' && (
              <>
                <h3>MIT License</h3>
                <p>Copyright (c) 2026 {module.author}</p>
                <p>Permission is hereby granted...</p>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-6 text-xl font-semibold">Metadata</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-bg-500">Version</span>
                <span className="font-mono">{module.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bg-500">License</span>
                <span>MIT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bg-500">Category</span>
                <TagChip variant="outlined" label={module.category} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-xl font-semibold">Links</h3>
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <Icon icon="tabler:world" />
                <span>Website</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:underline">
                <Icon icon="tabler:brand-github" />
                <span>Repository</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:underline">
                <Icon icon="tabler:bug" />
                <span>Report an issue</span>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
