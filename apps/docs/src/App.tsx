/* eslint-disable jsx-a11y/heading-has-content */
import { MDXComponents } from 'mdx/types'
import { useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'

import Boilerplate from './components/Boilerplate'
import Header from './components/Header'
import Rightbar from './components/Rightbar'
import Sidebar from './components/Sidebar'
import Configuration from './contents/getting-started/Configuration.mdx'
import Deployment from './contents/getting-started/Deployment.mdx'
import Installation from './contents/getting-started/Installation.mdx'
import Introduction from './contents/getting-started/Introduction.mdx'
import APIKeys from './contents/user-guide/APIKeys.mdx'
import Dashboard from './contents/user-guide/Dashboard.mdx'
import Modules from './contents/user-guide/Modules.mdx'
import Personalization from './contents/user-guide/Personalization.mdx'
import QuickStart from './contents/user-guide/QuickStart.mdx'

const components: MDXComponents = {
  em(properties) {
    return <i {...properties} />
  },
  h6(properties) {
    return (
      <h6 {...properties} className="text-custom-500 font-medium sm:text-lg" />
    )
  },
  h1(properties) {
    return (
      <h1
        {...properties}
        className="mt-2 mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl"
      />
    )
  },
  h2(properties) {
    return (
      <h2
        {...properties}
        className="mt-8 text-2xl font-semibold sm:mt-12 sm:text-3xl"
      />
    )
  },
  h3(properties) {
    return (
      <h3 {...properties} className="mt-6 text-xl font-semibold sm:text-2xl" />
    )
  },
  p(properties) {
    return <p {...properties} className="text-bg-500 mt-4 sm:mt-6 sm:text-lg" />
  },
  hr(properties) {
    return (
      <hr
        {...properties}
        className="border-bg-800 mt-8 mb-4 border-t-[1.5px] sm:mt-12 sm:mb-8"
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
    return <ul {...properties} className="mt-4 list-disc space-y-4 pl-6" />
  },
  li(properties) {
    return <li {...properties} className="text-bg-500 sm:text-lg" />
  },
  strong(properties) {
    return <strong {...properties} className="text-bg-100 font-semibold" />
  },
  code(properties) {
    return (
      <div className="bg-bg-800 mt-6 rounded-md">
        <code {...properties} />
      </div>
    )
  },
  table(properties) {
    return (
      <table
        {...properties}
        className="border-bg-800 mt-6 w-full border-collapse border-[1.5px]"
      />
    )
  },
  th(properties) {
    return (
      <th
        {...properties}
        className="border-bg-800 border-[1.5px] px-4 py-2 text-left"
      />
    )
  },
  td(properties) {
    return (
      <td
        {...properties}
        className="border-bg-800 border-[1.5px] px-4 py-2 text-left first:break-all"
      />
    )
  },
  img(properties) {
    return <img {...properties} className="w-full rounded-lg" />
  }
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className="bg-bg-900 text-bg-200 flex h-dvh w-full flex-col">
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1">
        <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <Routes>
          <Route
            element={<Navigate to="/getting-started/introduction" />}
            path="/"
          />
          <Route element={<Boilerplate />}>
            <Route path="/getting-started">
              <Route
                element={<Introduction components={components} />}
                path="introduction"
              />
              <Route
                element={<Installation components={components} />}
                path="installation"
              />
              <Route
                element={<Configuration components={components} />}
                path="configuration"
              />
              <Route
                element={<Deployment components={components} />}
                path="deployment"
              />
            </Route>
            <Route path="/user-guide">
              <Route
                element={<QuickStart components={components} />}
                path="quick-start"
              />
              <Route
                element={<Dashboard components={components} />}
                path="dashboard"
              />
              <Route
                element={<Modules components={components} />}
                path="modules"
              />
              <Route
                element={<Personalization components={components} />}
                path="personalization"
              />
              <Route
                element={<APIKeys components={components} />}
                path="api-keys"
              />
            </Route>
          </Route>
        </Routes>
        <Rightbar />
      </div>
    </main>
  )
}

export default App
