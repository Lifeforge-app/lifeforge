import { Icon } from '@iconify/react'
import { Button, Card, TagChip } from 'lifeforge-ui'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import ModuleCard from '@/components/modules/ModuleCard'
import { CATEGORIES_CONFIG, MODULES } from '@/data/modules'

export default function Home() {
  const featuredModules = MODULES.slice(0, 4)
  const recentModules = MODULES.slice(3, 6)
  const [activeSpotlight] = useState(0)

  const spotlightModule = featuredModules[activeSpotlight]

  return (
    <div className="space-y-16 pb-20">
      {/* Featured Spotlight Section - Steam Style */}
      <section className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured & Recommended</h2>
          <Button
            as={Link}
            to="/registry"
            variant="plain"
            icon="tabler:chevron-right"
            iconPosition="end"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Main Spotlight */}
          <Link
            to={`/module/${spotlightModule.id}`}
            className="group relative col-span-2 flex-1 overflow-hidden rounded-xl"
          >
            <div className="bg-custom-500/5 border-bg-200 dark:border-bg-800 aspect-[16/9] w-full rounded-xl border">
              <div className="flex-center size-full">
                <div className="bg-custom-500/10 text-custom-500 group-hover:bg-custom-500 group-hover:text-bg-900 flex-center size-32 rounded-2xl transition-all duration-300">
                  <Icon icon={spotlightModule.icon} className="size-16" />
                </div>
              </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-16">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {spotlightModule.name}
                  </h3>
                  <p className="text-bg-500 mb-3">
                    {spotlightModule.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <TagChip
                      label={spotlightModule.category}
                      variant="filled"
                      className="text-xs!"
                    />
                    <span className="text-bg-500 text-sm">
                      by {spotlightModule.author}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Icon
                      icon="tabler:star-filled"
                      className="size-4 text-yellow-500"
                    />
                    {spotlightModule.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="tabler:download" className="size-4" />
                    {spotlightModule.downloads.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Category Browser */}
          <div className="hidden shrink-0 flex-col lg:flex">
            <div className="grid flex-1 grid-cols-2 gap-3">
              {CATEGORIES_CONFIG.map(category => (
                <Card
                  as={Link}
                  key={category.name}
                  to={`/registry?category=${category.name}`}
                  className="bg-bg-100 dark:bg-bg-900 group relative flex flex-col items-start gap-2 overflow-hidden rounded-xl p-6 transition-all hover:scale-105"
                >
                  <div
                    className={`flex-center size-16 shrink-0 rounded-lg ${category.color}`}
                  >
                    <Icon icon={category.icon} className="size-8" />
                  </div>
                  <div className="mt-4">
                    <p className="group-hover:text-custom-500 text-xl font-semibold">
                      {category.name}
                    </p>
                    <p className="text-bg-500">
                      {MODULES.filter(m => m.category === category.name).length}{' '}
                      modules
                    </p>
                  </div>
                  <Icon
                    icon="tabler:arrow-up-right"
                    className="text-bg-300 dark:text-bg-700 absolute top-6 right-6 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-custom-500/10 text-custom-500 flex-center size-10 rounded-lg">
              <Icon icon="tabler:star-filled" className="size-5" />
            </div>
            <h2 className="text-2xl font-bold">Featured Modules</h2>
          </div>
          <Button
            as={Link}
            to="/registry"
            variant="plain"
            icon="tabler:chevron-right"
            iconPosition="end"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      {/* Popular This Week */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-center size-10 rounded-lg bg-amber-500/10 text-amber-500">
              <Icon icon="tabler:flame" className="size-5" />
            </div>
            <h2 className="text-2xl font-bold">Popular This Week</h2>
          </div>
          <Button
            as={Link}
            to="/registry?sort=popular"
            variant="plain"
            icon="tabler:chevron-right"
            iconPosition="end"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MODULES.slice(0, 4).map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      {/* Recently Updated */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-center size-10 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Icon icon="tabler:refresh" className="size-5" />
            </div>
            <h2 className="text-2xl font-bold">Recently Updated</h2>
          </div>
          <Button
            as={Link}
            to="/registry?sort=updated"
            variant="plain"
            icon="tabler:chevron-right"
            iconPosition="end"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </div>
  )
}
