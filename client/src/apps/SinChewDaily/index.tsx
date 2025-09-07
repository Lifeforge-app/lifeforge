import forgeAPI from '@utils/forgeAPI'
import {
  EmptyStateScreen,
  ListboxInput,
  ListboxOption,
  LoadingScreen,
  ModuleHeader,
  Pagination
} from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'

import ArticleItem from './components/ArticleItem'

const CATEGORIES = [
  'latest',
  'headline',
  'hot',
  'domestic:latest',
  'domestic:realtime',
  'domestic:editor-choice',
  'domestic:hot',
  'domestic:society',
  'domestic:education',
  'domestic:chinese-society',
  'domestic:headline',
  'domestic:warm-action',
  'domestic:mixed',
  'domestic:politics',
  'domestic:truth-seeking',
  'international:latest',
  'international:worldwide',
  'international:headline',
  'international:international-platter',
  'international:explore-the-world',
  'finance:latest',
  'finance:spotlight',
  'finance:international',
  'entertainment:latest',
  'entertainment:foreign',
  'entertainment:msia',
  'local:johor:focus',
  'local:johor:singapore',
  'local:johor:eye',
  'local:johor:mixed',
  'local:metropolis:headline',
  'local:metropolis:dynamic',
  'local:metropolis:interesting',
  'local:metropolis:story',
  'local:metropolis:perspective',
  'local:perak:focus',
  'local:perak:special-column',
  'local:perak:dynamic',
  'local:perak:school',
  'local:perak:society',
  'local:perak:people',
  'supplement:topic',
  'supplement:lifestyle',
  'supplement:travel',
  'supplement:food',
  'supplement:column',
  'supplement:things',
  'supplement:fashion',
  'supplement:new-education',
  'supplement:e-trend',
  'supplement:arts',
  'supplement:life-protection',
  'supplement:car-viewing',
  'supplement:wellness',
  'supplement:family',
  'supplement:people',
  'supplement:audio-video',
  'supplement:readers',
  'supplement:flower-trace',
  'supplement:creation',
  'supplement:airasia-news',
  'xuehai:power-teens',
  'xuehai:study-record',
  'xuehai:hou-lang-fang'
] as const

const CUSTOM_MAX_PAGE = {
  hot: 10
}

const RANGES = ['6H', '24H', '1W'] as const

export type NewsArticle = InferOutput<typeof forgeAPI.sinChewDaily.list>[number]

interface CategoryStructure {
  [key: string]: {
    subcategories?: {
      [key: string]: {
        subsubcategories?: string[]
      }
    }
  }
}

function SinChewDaily() {
  const { t } = useTranslation('apps.sinChewDaily')

  const [page, setPage] = useState(1)

  const [mainCategory, setMainCategory] = useState<string>('latest')

  const [subCategory, setSubCategory] = useState<string>('')

  const [subSubCategory, setSubSubCategory] = useState<string>('')

  const [range, setRange] = useState<(typeof RANGES)[number]>(RANGES[0])

  const [newsList, setNewsList] = useState<NewsArticle[] | 'loading'>('loading')

  const categoryStructure = useMemo<CategoryStructure>(() => {
    const structure: CategoryStructure = {}

    CATEGORIES.forEach(cat => {
      const parts = cat.split(':')

      const main = parts[0]

      const sub = parts[1]

      const subsub = parts[2]

      if (!structure[main]) {
        structure[main] = {}
      }

      if (sub) {
        if (!structure[main].subcategories) {
          structure[main].subcategories = {}
        }

        if (!structure[main].subcategories![sub]) {
          structure[main].subcategories![sub] = {}
        }

        if (subsub) {
          if (!structure[main].subcategories![sub].subsubcategories) {
            structure[main].subcategories![sub].subsubcategories = []
          }

          if (
            !structure[main].subcategories![sub].subsubcategories!.includes(
              subsub
            )
          ) {
            structure[main].subcategories![sub].subsubcategories!.push(subsub)
          }
        }
      }
    })

    return structure
  }, [])

  const availableSubCategories = useMemo(() => {
    return categoryStructure[mainCategory]?.subcategories
      ? Object.keys(categoryStructure[mainCategory].subcategories!)
      : []
  }, [categoryStructure, mainCategory])

  const availableSubSubCategories = useMemo(() => {
    return (
      categoryStructure[mainCategory]?.subcategories?.[subCategory]
        ?.subsubcategories || []
    )
  }, [categoryStructure, mainCategory, subCategory])

  const fullCategory = useMemo(() => {
    let result = mainCategory

    if (subCategory) {
      result += `:${subCategory}`

      if (subSubCategory) {
        result += `:${subSubCategory}`
      }
    }

    return result
  }, [mainCategory, subCategory, subSubCategory])

  const shouldShowEmptyState = useMemo(() => {
    if (availableSubCategories.length > 0 && !subCategory) {
      return true
    }

    if (availableSubSubCategories.length > 0 && !subSubCategory) {
      return true
    }

    return false
  }, [
    availableSubCategories.length,
    subCategory,
    availableSubSubCategories.length,
    subSubCategory
  ])

  useEffect(() => {
    if (shouldShowEmptyState) {
      setNewsList([])

      return
    }

    const fetchData = async () => {
      setNewsList('loading')

      const data = await forgeAPI.sinChewDaily.list
        .input({
          type: fullCategory as (typeof CATEGORIES)[number],
          page: page.toString(),
          ...(fullCategory === 'hot' ? { range } : {})
        })
        .query()

      setNewsList(data)
    }

    fetchData()
  }, [fullCategory, range, page, shouldShowEmptyState])

  useEffect(() => {
    setPage(1)
  }, [fullCategory, range])

  useEffect(() => {
    setSubCategory('')
    setSubSubCategory('')
  }, [mainCategory])

  useEffect(() => {
    setSubSubCategory('')
  }, [subCategory])

  return (
    <>
      <ModuleHeader />
      <div className="flex w-full flex-wrap items-center gap-3">
        <ListboxInput
          buttonContent={<span>{t(`categories.${mainCategory}`)}</span>}
          className="flex-1"
          icon="tabler:category"
          label="category"
          namespace="apps.sinChewDaily"
          setValue={setMainCategory}
          value={mainCategory}
        >
          {Object.keys(categoryStructure).map(cat => (
            <ListboxOption
              key={cat}
              label={t(`categories.${cat}`)}
              value={cat}
            />
          ))}
        </ListboxInput>
        {availableSubCategories.length > 0 && (
          <ListboxInput
            buttonContent={
              <span>
                {t(`categories.${subCategory}`) ||
                  t('inputs.subcategory.placeholder')}
              </span>
            }
            className="flex-1"
            icon="tabler:folder"
            label="subcategory"
            namespace="apps.sinChewDaily"
            setValue={setSubCategory}
            value={subCategory}
          >
            {availableSubCategories.map(subCat => (
              <ListboxOption
                key={subCat}
                label={t(`categories.${subCat}`)}
                value={subCat}
              />
            ))}
          </ListboxInput>
        )}

        {availableSubSubCategories.length > 0 && (
          <ListboxInput
            buttonContent={
              <span>
                {t(`categories.${subSubCategory}`) ||
                  t('inputs.sub-subcategory.placeholder')}
              </span>
            }
            className="flex-1"
            icon="tabler:folders"
            label="subSubcategory"
            namespace="apps.sinChewDaily"
            setValue={setSubSubCategory}
            value={subSubCategory}
          >
            {availableSubSubCategories.map(subSubCat => (
              <ListboxOption
                key={subSubCat}
                label={t(`categories.${subSubCat}`)}
                value={subSubCat}
              />
            ))}
          </ListboxInput>
        )}

        {fullCategory === 'hot' && (
          <ListboxInput
            buttonContent={<span>{range}</span>}
            className="flex-1"
            icon="tabler:clock"
            label="range"
            namespace="apps.sinChewDaily"
            setValue={setRange}
            value={range}
          >
            {RANGES.map(rng => (
              <ListboxOption key={rng} label={rng} value={rng} />
            ))}
          </ListboxInput>
        )}
      </div>
      {shouldShowEmptyState ? (
        <EmptyStateScreen
          description="You need to select all available category levels to view the news articles."
          icon="tabler:folder-question"
          name="subcategory"
          namespace="apps.sinChewDaily"
        />
      ) : newsList === 'loading' ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="my-6 space-y-3">
            {newsList.map(item => (
              <ArticleItem key={item.id} item={item} />
            ))}
          </div>
          <Pagination
            className="mb-8"
            currentPage={page}
            totalPages={
              fullCategory in CUSTOM_MAX_PAGE
                ? CUSTOM_MAX_PAGE[fullCategory as keyof typeof CUSTOM_MAX_PAGE]
                : 30
            }
            onPageChange={setPage}
          />
        </>
      )}
    </>
  )
}

export default SinChewDaily
