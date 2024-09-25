import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { algsetAlgs, algsetScrambles } from '../../algorithms/OLL'
import { applyMoves, DEFAULT_CUBE } from '../../scripts/genCube'

function CFOPF2L(): React.ReactElement {
  const navigate = useNavigate()
  return (
    <ModuleWrapper>
      <header className="space-y-1">
        <GoBackButton
          onClick={() => {
            navigate('/cfop-algorithms')
          }}
        />
        <div className="flex-between flex">
          <h1 className="flex items-center gap-4 text-2xl font-semibold sm:text-3xl">
            <img
              src="/assets/cfop/landing-oll.webp"
              alt="OLL"
              className="size-16"
            />
            Orientation of the Last Layer
          </h1>
        </div>
      </header>
      <ul className="my-8 space-y-4">
        {algsetScrambles.map((algset, index) => {
          let cube = DEFAULT_CUBE
          cube = applyMoves(cube, algset[0])

          return (
            <li
              key={index}
              className="flex w-full items-center justify-between gap-8 rounded-md bg-bg-50 p-4 shadow-custom dark:bg-bg-900"
            >
              <div className="flex items-center gap-8">
                <div className="rounded-md bg-bg-200/70 p-2 dark:bg-bg-800/70">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-0.5">
                      <div className="size-5"></div>
                      {cube.back[0].reverse().map((col, i) => (
                        <div key={i} className="flex size-5 items-end gap-0.5">
                          <div
                            className={`h-1 w-5 rounded-full ${
                              col === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            }`}
                          ></div>
                        </div>
                      ))}
                      <div className="size-5"></div>
                    </div>
                    {cube.top.map((row, i) => (
                      <div key={i} className="flex gap-0.5">
                        <div className="flex size-5 justify-end">
                          <div
                            className={`h-5 w-1 rounded-full ${
                              cube.left[0][i] === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            }`}
                          ></div>
                        </div>
                        {row.map((col, i) => (
                          <div
                            key={i}
                            className={`size-5 rounded-sm ${
                              col === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            }`}
                          ></div>
                        ))}
                        <div className="flex size-5 justify-start">
                          <div
                            className={`h-5 w-1 rounded-full ${
                              cube.right[0][2 - i] === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-0.5">
                      <div className="size-5"></div>
                      {cube.front[0].map((col, i) => (
                        <div key={i} className="flex size-5 items-start">
                          <div
                            className={`h-1 w-5 rounded-full ${
                              col === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            }`}
                          ></div>
                        </div>
                      ))}
                      <div className="size-5"></div>
                    </div>
                  </div>
                </div>
                <p className="text-xl">{algsetAlgs[index].alg[0]}</p>
              </div>
              <p className="mr-8 text-xl text-bg-500">
                {algsetAlgs[index].group}
              </p>
            </li>
          )
        })}
      </ul>
    </ModuleWrapper>
  )
}

export default CFOPF2L
