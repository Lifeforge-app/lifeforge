import { Icon } from '@iconify/react'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'

function About(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="About" desc="..." />
      <div className="mt-6 h-full overflow-y-scroll pb-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-2xl">By far the largest personal project</p>
            <h3 className="text-4xl font-medium">
              by{' '}
              <span className="font-semibold text-custom-500">Melvin Chia</span>
            </h3>
          </div>
          <div>
            <h1 className="mt-8 text-right text-5xl font-bold">
              An All-In-One Platform
            </h1>
            <h2 className="mt-4 text-right text-5xl font-semibold text-bg-500">
              For Managing Your Life
            </h2>
          </div>
        </div>
        <div className="mt-6 flex w-full overflow-hidden rounded-md bg-custom-500">
          <img
            src="/assets/about1.jpg"
            alt="about"
            className="h-[27rem] w-3/4 object-cover object-center"
          />
          <div className="min-h-0 w-1/4">
            <div className="my-12 min-h-0 w-[30rem] -translate-x-1/2 rounded-md bg-bg-100 p-8 shadow-lg dark:bg-bg-900">
              <h2 className="text-3xl font-medium">The Stories Begin...</h2>
              <p className="mt-4 text-bg-500">
                As an aviation enthusiast, I have always been fascinated by
                those interfaces and buttons in the cockpit. It was last year
                when I was watching a vlog about a pilot's life, and I saw the
                pilot manipulating the FMC (Flight Management Computer) in the
                cockpit. I was so intrigued by the interface that at the spur of
                the moment, I decided to create an all-in-one system, for me to
                manage my own life, just like a pilot manages the aircraft in
                the cockpit.
              </p>
            </div>
          </div>
        </div>
        <span className="mt-24 block w-full text-center font-semibold uppercase tracking-widest text-custom-500">
          the reasons
        </span>
        <h1 className="mt-2 text-center text-5xl font-bold">
          Why This Project?
        </h1>
        <div className="relative z-10 mx-auto -mt-2 grid max-w-7xl grid-cols-1 gap-6 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md bg-bg-50 p-8 text-center shadow-lg dark:bg-bg-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md text-custom-500">
              <Icon icon="tabler:rocket" className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-medium">Productivity Boost</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-bg-500">
              I seek to boost productivity with a centralized system. By
              designing my own management system, my can align features with my
              goals, saving time and reducing mental overhead.
            </p>
          </div>
          <div className="rounded-md bg-bg-50 p-8 text-center shadow-lg dark:bg-bg-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md text-custom-500">
              <Icon icon="tabler:bulb" className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-medium">Learning Experience</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-bg-500">
              Building a full-stack project lets me learn across various
              technologies. Whether it&apos;s frontend with ReactJS and
              TailwindCSS, or backend with ExpressJS and Pocketbase, each part
              offers valuable learning.
            </p>
          </div>
          <div className="rounded-md bg-bg-50 p-8 text-center shadow-lg dark:bg-bg-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md text-custom-500">
              <Icon icon="tabler:pencil" className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-medium">Customization</h3>
            <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-bg-500">
              I want a system tailored to my needs. Off-the-shelf solutions may
              not fit, so building my own allows full customization to match
              your workflow and habits.
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-16">
          <div className="w-full">
            <span className="block w-full text-left font-semibold uppercase tracking-widest text-custom-500">
              the solutions
            </span>
            <h1 className="mt-2 text-left text-5xl font-bold">
              All-In-One Platform
            </h1>
            <p className="mt-6 text-left text-bg-500">
              I&apos;ve designed this platform to be an all-in-one platform for
              managing my life. It is by far my largest personal project that I
              will continue to work on for a long time in the future.
            </p>
            <ul className="mt-8 flex flex-col gap-8 text-left text-bg-500">
              <li className="flex gap-2">
                <Icon
                  icon="tabler:dashboard"
                  className="h-6 w-6 shrink-0 text-custom-500"
                />
                <p>
                  <span className="font-semibold">Project Management</span> A
                  full project management system packed with all sorts of
                  features to manage my development projects.
                </p>
              </li>
              <li className="flex gap-2">
                <Icon
                  icon="tabler:calendar"
                  className="h-6 w-6 shrink-0 text-custom-500"
                />
                <p>
                  <span className="font-semibold">Daily Management</span> A
                  calendar, a task list, etc. to help me keep track of my daily
                  tasks and events.
                </p>
              </li>
              <li className="flex gap-2">
                <Icon
                  icon="tabler:notebook"
                  className="h-6 w-6 shrink-0 text-custom-500"
                />
                <p>
                  <span className="font-semibold">Study Management</span>{' '}
                  Pomodoro Timer, Flashcards, Notes Archive, and more to help me
                  study more effectively.
                </p>
              </li>
              <li>... and more features!</li>
            </ul>
            <Button icon="tabler:arrow-right" className="mt-8">
              Go to Dashboard
            </Button>
          </div>
          <div className="flex h-full">
            <img
              src="/assets/about2.jpg"
              alt="about"
              className="h-full rounded-md object-cover shadow-md"
            />
          </div>
        </div>
        <span className="mt-20 block w-full text-center font-semibold uppercase tracking-widest text-custom-500">
          the pricing
        </span>
        <h1 className="mt-2 text-center text-5xl font-bold">
          Pay Once, Use Forever
        </h1>
        <p className="mx-auto mt-6 w-1/2 text-center text-bg-500">
          The platform is free to use, but there is also a Pro Plan for those
          who want more storage and features. If you want to host your own, you
          don&apos;t have to pay a cent.
        </p>
        <div className="mx-auto mt-8 flex  w-full max-w-4xl flex-wrap items-center justify-center gap-4 sm:gap-0">
          <div className="w-full rounded-lg bg-bg-50 p-6 shadow-lg dark:bg-bg-900 sm:w-1/2 sm:rounded-r-none sm:p-8">
            <div className="mb-6">
              <h3 className="jakarta text-2xl font-semibold sm:text-4xl">
                Free Plan
              </h3>
            </div>
            <div className="mb-4 space-x-2">
              <span className="text-4xl font-bold">$0/mo</span>
            </div>
            <ul className="mb-6 space-y-2 text-bg-500">
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">1GB Storage Space</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">5 Projects</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">Basic Settings</span>
              </li>
            </ul>
            <Button icon="tabler:arrow-right" className="mt-8 w-full">
              Get Started
            </Button>
          </div>

          <div className="w-full rounded-lg bg-custom-500 p-6 shadow-xl sm:w-1/2 sm:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row">
              <div>
                <h3 className="jakarta text-2xl font-semibold text-bg-100 sm:text-4xl">
                  Pro Plan
                </h3>
              </div>
              <span className="order-first inline-block rounded-full bg-black bg-opacity-20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bg-100 lg:order-none">
                Go Pro
              </span>
            </div>
            <div className="mb-4 space-x-2">
              <span className="text-4xl font-bold text-bg-100">$15/mo</span>
              <span className="text-2xl text-custom-100 line-through">
                $39/mo
              </span>
            </div>
            <ul className="mb-6 space-y-2 text-custom-100">
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">20GB Storage Space</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">Unlimited Projects</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">Advanced Settings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Icon icon="uil:check" className="h-5 w-5" />
                <span className="">Priority Support</span>
              </li>
            </ul>
            <Button
              icon="tabler:arrow-right"
              className="mt-8 w-full bg-bg-100/20 dark:!text-bg-100"
            >
              7-Day Free Trial
            </Button>
          </div>
        </div>
        <div className="mt-24 flex items-center gap-16 rounded-md bg-custom-500 p-8 shadow-lg">
          <div className="w-full">
            <span className="block w-full text-left font-semibold uppercase tracking-widest text-custom-100">
              get started
            </span>
            <h1 className="mt-2 w-2/3 text-left text-5xl font-bold leading-tight text-bg-100">
              Start Keeping Track of Your Life Now.
            </h1>
          </div>
          <div className="flex h-full shrink-0">
            <Button icon="tabler:arrow-right" className="bg-bg-100 text-bg-800">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default About
