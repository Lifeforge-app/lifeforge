import clsx from 'clsx'
import { GoBackButton, ItemWrapper } from 'lifeforge-ui'
import { useNavigate } from 'react-router'

import { algsetAlgs, algsetScrambles } from '../../algorithms/OLL'
import { DEFAULT_CUBE, applyMoves } from '../../functions/genCube'

function CFOPF2L() {
  const navigate = useNavigate()

  return (
    <>
      <header className="space-y-1">
        <GoBackButton
          onClick={() => {
            navigate('/cfop-algorithms')
          }}
        />
        <div className="flex-between flex">
          <h1 className="flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
            <img
              alt="OLL"
              className="size-16"
              src="/assets/apps/CFOPAlgorithms/landing-oll.webp"
            />
            Orientation of the Last Layer
          </h1>
        </div>
      </header>
      <ul className="my-8 space-y-3">
        {algsetScrambles.map((algset, index) => {
          let cube = DEFAULT_CUBE
          cube = applyMoves(cube, algset[0])

          return (
            <ItemWrapper key={index} as="li" className="flex-between gap-8">
              <div className="flex items-center gap-8">
                <div className="bg-bg-200/70 dark:bg-bg-800/50 rounded-md p-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-0.5">
                      <div className="size-5"></div>
                      {cube.back[0].reverse().map((col, i) => (
                        <div key={i} className="flex size-5 items-end gap-0.5">
                          <div
                            className={clsx(
                              'h-1 w-5 rounded-full',
                              col === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            )}
                          ></div>
                        </div>
                      ))}
                      <div className="size-5"></div>
                    </div>
                    {cube.top.map((row, i) => (
                      <div key={i} className="flex gap-0.5">
                        <div className="flex size-5 justify-end">
                          <div
                            className={clsx(
                              'h-5 w-1 rounded-full',
                              cube.left[0][i] === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            )}
                          ></div>
                        </div>
                        {row.map((col, i) => (
                          <div
                            key={i}
                            className={clsx(
                              'size-5 rounded-sm',
                              col === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            )}
                          ></div>
                        ))}
                        <div className="flex size-5 justify-start">
                          <div
                            className={clsx(
                              'h-5 w-1 rounded-full',
                              cube.right[0][2 - i] === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            )}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-0.5">
                      <div className="size-5"></div>
                      {cube.front[0].map((col, i) => (
                        <div key={i} className="flex size-5 items-start">
                          <div
                            className={clsx(
                              'h-1 w-5 rounded-full',
                              col === 'Y'
                                ? 'bg-yellow-500'
                                : 'bg-bg-400 dark:bg-bg-700'
                            )}
                          ></div>
                        </div>
                      ))}
                      <div className="size-5"></div>
                    </div>
                  </div>
                </div>
                <p className="text-xl">{algsetAlgs[index].alg[0]}</p>
              </div>
              <p className="text-bg-500 mr-8 text-xl">
                {algsetAlgs[index].group}
              </p>
            </ItemWrapper>
          )
        })}
      </ul>
    </>
  )
}

export default CFOPF2L
