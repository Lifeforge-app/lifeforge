import { PBService } from '@functions/database'
import moment from 'moment'

import getStatistics from './statistics'

export default async function getReadmeHTML(pb: PBService) {
  const statistics = await getStatistics(pb)

  const today = moment().format('YYYY-MM-DD')

  const todayRecord = await pb.getList
    .collection('code_time__daily_entries')
    .page(1)
    .perPage(1)
    .filter([
      {
        field: 'date',
        operator: '=',
        value: `${today} 00:00:00.000Z`
      }
    ])
    .execute()

  const todayData = todayRecord.items[0]

  const todayTime = todayData ? todayData.total_minutes : 0

  return `
      <!DOCTYPE html>
  <html>
  
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet" />
    <style>
      * {
        font-family: "Onest", sans-serif;
      }
        
      .border-lime {
        border-color: #cedd3e !important;
      }

      .bg-lime {
        background-color: #cedd3e;
      }

      .text-lime {
        color: #cedd3e;
      }
    </style>
  </head>
  
  <body class="flex p-4 text-bg-100 flex-col w-full h-dvh border-lime border-2 bg-bg-900">
    <header class="border-b-2 border-bg-800 p-2 w-full flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lime">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m7 8l-4 4l4 4m10-8l4 4l-4 4M14 4l-4 16" />
        </svg>
        <h1 class="text-lg font-medium">Code Time Statistics</h1>
      </div>
      <div class="tracking-wider font-medium text-sm flex items-center gap-1">
        <span class="text-bg-500">powered by</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-lime">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m11.414 10l-7.383 7.418a2.09 2.09 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0L14.414 13m3.707 2.293l2.586-2.586a1 1 0 0 0 0-1.414l-7.586-7.586a1 1 0 0 0-1.414 0L9.121 6.293a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0" />
        </svg>
        <span>Lifeforge<span class="text-lime">.</span></span>
      </div>
    </header>
    <div class="flex-1 w-full space-y-2 mt-4">
      <div class="bg-lime w-full p-2 flex items-center justify-between rounded-sm text-bg-900">
        <div class="flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 0l3 2m-3-7v5" />
          </svg>
          Total Time Spent
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment.duration(statistics['Total time spent'], 'minutes').asHours()
          )}<span class="text-lime-800 text-xl">h</span> ${Math.floor(
            moment
              .duration(statistics['Total time spent'], 'minutes')
              .asMinutes() % 60
          )}<span
              class="text-lime-800 text-xl">m</span></span>
        </div>
      </div>
      <div
        class="bg-bg-800/50 border-lime border-2 text-lime w-full p-2 flex items-center justify-between rounded-sm">
        <div class="flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12a9 9 0 0 0 5.998 8.485M21 12a9 9 0 1 0-18 0m9-5v5m0 3h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2m3-6v2a1 1 0 0 0 1 1h1m1-3v6" />
          </svg>
          Time Spent Today
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment.duration(todayTime, 'minutes').asHours()
          )}<span class="text-bg-600 text-xl">h</span> ${Math.floor(
            moment.duration(todayTime, 'minutes').asMinutes() % 60
          )}<span
              class="text-bg-600 text-xl">m</span></span>
        </div>
      </div>
      <div class="bg-bg-800/50 w-full p-2 flex items-center justify-between rounded-sm">
        <div class="flex items-center text-bg-400 gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path
                d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1s2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2" />
              <path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" />
              <path d="M16.746 16.726a3 3 0 1 0 .252-5.555" />
            </g>
          </svg>
          Most Time Spent per Day
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment.duration(statistics['Most time spent'], 'minutes').asHours()
          )}<span class="text-bg-600 text-xl">h</span> ${Math.floor(
            moment
              .duration(statistics['Most time spent'], 'minutes')
              .asMinutes() % 60
          )}<span
              class="text-bg-600 text-xl">m</span></span>
        </div>
      </div>
      <div class="bg-bg-800/50 w-full p-2 flex items-center justify-between rounded-sm">
        <div class="flex items-center text-bg-400 gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M5 13a7 7 0 1 0 14 0a7 7 0 0 0-14 0m2-9L4.25 6M17 4l2.75 2" />
              <path d="M8 13h1l2 3l2-6l2 3h1" />
            </g>
          </svg>
          Average Time Spent per Day
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment
              .duration(statistics['Average time spent'], 'minutes')
              .asHours()
          )}<span class="text-bg-600 text-xl">h</span> ${Math.floor(
            moment
              .duration(statistics['Average time spent'], 'minutes')
              .asMinutes() % 60
          )}<span
              class="text-bg-600 text-xl">m</span></span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="bg-bg-800/50 w-full p-2 flex items-center justify-between rounded-sm">
          <div class="flex items-center text-bg-400 gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M10 2c0-.88 1.056-1.331 1.692-.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08.174l.012.003c.625.133 1.203-.43 2.303-2.173l.14-.224a1 1 0 0 1 1.582-.153C18.733 9.46 20 12.402 20 14.295C20 18.56 16.409 22 12 22s-8-3.44-8-7.706c0-2.252 1.022-4.716 2.632-6.301l.605-.589c.241-.236.434-.43.618-.624C9.285 5.268 10 3.856 10 2"  />
              </g>
            </svg>
            Current Streak
          </div>
          <div>
            <span class="text-2xl font-semibold tracking-wider">${
              statistics['Current streak']
            }<span
                class="text-bg-600 text-xl ml-1">days</span></span>
          </div>
        </div>
        <div class="bg-bg-800/50 w-full p-2 flex items-center justify-between rounded-sm">
          <div class="flex items-center text-bg-400 gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lime">
              <path fill="currentColor"
                d="M10 2c0-.88 1.056-1.331 1.692-.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08.174l.012.003c.625.133 1.203-.43 2.303-2.173l.14-.224a1 1 0 0 1 1.582-.153C18.733 9.46 20 12.402 20 14.295C20 18.56 16.409 22 12 22s-8-3.44-8-7.706c0-2.252 1.022-4.716 2.632-6.301l.605-.589c.241-.236.434-.43.618-.624C9.285 5.268 10 3.856 10 2" />
            </svg>
            Longest Streak
          </div>
          <div>
            <span class="text-2xl font-semibold tracking-wider">${Math.max(
              statistics['Longest streak'],
              statistics['Current streak']
            )}<span
                class="text-bg-600 text-xl ml-1">days</span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t-2 mt-4 border-bg-800 flex items-center justify-between p-2 text-sm">
      <p class="flex text-bg-500">[Computer Generated Report]</span>
      </p>
      <p class="flex text-bg-500">Last updated: <span class="font-medium text-bg-100 pl-1">${moment().format(
        'YYYY-MM-DD HH:mm:ss'
      )}</span>
      </p>
    </div>
  </body>
  
  </html>
    `
}
