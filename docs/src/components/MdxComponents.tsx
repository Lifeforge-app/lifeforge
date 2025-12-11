import { Icon } from '@iconify/react'
import clsx from 'clsx'
import type { MDXComponents } from 'mdx/types'
import Zoom from 'react-medium-image-zoom'
import { Link } from 'shared'

const HashIcon = ({ className }: { className?: string }) => (
  <Icon
    className={clsx(
      'text-custom-500 stroke-custom-500 top-1/2 -left-6 stroke-[1px]! sm:absolute sm:-left-8 sm:-translate-y-1/2',
      className
    )}
    icon="streamline-sharp:sign-hashtag-remix"
  />
)

export const components: MDXComponents = {
  em(properties) {
    return <i {...properties} />
  },
  h6(properties) {
    return (
      <h6 {...properties} className="text-custom-500 font-medium sm:text-lg" />
    )
  },
  h1(properties) {
    return <h1 {...properties} className="my-2 text-4xl font-bold" />
  },
  h2(properties) {
    return (
      <h2
        {...properties}
        className="relative mt-8 flex items-center gap-2 text-2xl font-semibold sm:mt-12 sm:text-3xl"
      >
        <HashIcon className="text-lg sm:text-xl" />
        {properties.children}
      </h2>
    )
  },
  h3(properties) {
    return (
      <h3
        {...properties}
        className="relative mt-10 flex items-center gap-2 text-xl font-semibold sm:text-2xl"
      >
        <HashIcon className="text-base sm:text-lg" />
        {properties.children}
      </h3>
    )
  },
  h4(properties) {
    return (
      <h4
        {...properties}
        className="relative mt-8 text-lg font-semibold sm:text-xl"
      >
        <HashIcon />
        {properties.children}
      </h4>
    )
  },
  p(properties) {
    return <p {...properties} className="text-bg-600 dark:text-bg-400 mt-6" />
  },
  hr(properties) {
    return (
      <hr
        {...properties}
        className="border-bg-200 dark:border-bg-800 mt-8 mb-4 border-t-[1.5px] sm:mt-12 sm:mb-8"
      />
    )
  },
  a(properties) {
    return (
      <Link
        className="text-custom-500 font-medium underline"
        to={properties.href || ''}
      >
        {properties.children}
      </Link>
    )
  },
  ul(properties) {
    return <ul {...properties} className="mt-4 list-disc space-y-3 pl-6" />
  },
  li(properties) {
    return <li {...properties} className="dark:text-bg-400 text-bg-600" />
  },
  strong(properties) {
    return (
      <strong
        {...properties}
        className="text-bg-800 dark:text-bg-100 font-semibold"
      />
    )
  },
  code() {
    return (
      <div className="text-5xl text-red-500">
        USE CUSTOM COMPONENT FOR CODE SNIPPET
      </div>
    )
  },
  table(properties) {
    return (
      <table
        {...properties}
        className="border-bg-200 dark:border-bg-800 mt-6 w-full border-collapse border-[1.5px]"
      />
    )
  },
  th(properties) {
    return (
      <th
        {...properties}
        className="border-bg-200 dark:border-bg-800 border-[1.5px] px-4 py-2 text-left"
      />
    )
  },
  td(properties) {
    return (
      <td
        {...properties}
        className="border-bg-200 dark:border-bg-800 border-[1.5px] px-4 py-2 text-left first:break-all"
      />
    )
  },
  img(properties) {
    return (
      <Zoom zoomImg={properties.src}>
        <div className="flex-center w-full pt-2 pb-4">
          <img {...properties} alt="" className="rounded-lg sm:w-[80%]" />
        </div>
      </Zoom>
    )
  },
  blockquote(properties) {
    return (
      <blockquote
        {...properties}
        className="border-bg-200 dark:border-bg-800 my-4 border-l-4 pl-4 italic"
      />
    )
  }
}
