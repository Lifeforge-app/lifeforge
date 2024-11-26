import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import useThemeColors from '@hooks/useThemeColor'
import Cube from './Cube'

const sections: Array<{
  name: React.ReactElement | string
  subsections: Array<{
    name: React.ReactElement | string
    subsubsections: Array<{
      name: React.ReactElement | string
      desc?: React.ReactElement | string
      algs: Array<{
        alg: string[]
        warn?: number[]
        pattern: string
      }>
    }>
  }>
}> = [
  {
    name: 'BASIC F2L',
    subsections: [
      {
        name: '1A. Both pieces are on top.',
        subsubsections: [
          {
            name: (
              <>
                White sticker facing <span className="text-custom-500">Up</span>
              </>
            ),
            algs: [
              {
                alg: ["U2 (R U R') U (R U' R')", "y F R U2 R' F'"],
                pattern: '--grr-rr- r---gg-gg ---r----w'
              },
              {
                alg: ["y U2 (L' U' L) U' (L' U L)", "F' L' U2 L F"],
                pattern: '--grr-rr- r---gg-gg -g------w'
              },
              {
                alg: ["U (R U2 R') U (R U' R')"],
                pattern: '--grr-rr- r---gg-gg -r------w'
              },
              {
                alg: ["y U' (L' U2 L) U' (L' U L)"],
                pattern: '--grr-rr- r---gg-gg ---g----w'
              },
              {
                alg: [
                  "U (R U' R') U' (R U' R' U R U' R')",
                  "U (F R' F' R) U (R U R')",
                  "U2 (L F' L' F) (R U R')",
                  "y U L' U' (L2 F' L' F) (L' U L)",
                  "y F' (U' L' U L) F (L' U L)",
                  "y' U2 R U' R' U' S R' S'"
                ],
                warn: [2, 5],
                pattern: '-ggrr-rr- r---gg-gg -------rw'
              },
              {
                alg: [
                  "y U' (L' U L) U (L' U L U' L' U L)",
                  "y U' (F' L F L') U' (L' U' L)",
                  "y U2 (R F' R' F) (L' U' L)",
                  "U' R U (R2' F R F') (R U' R')",
                  "F (U R U' R') F' (R U' R')",
                  "y2 U2 L' U L U S' L S"
                ],
                warn: [2, 5],
                pattern: '--grr-rr- rr--gg-gg -----g--w'
              },
              {
                alg: ["(R U2 R') U' (R U R')"],
                pattern: '--grr-rr- rg--gg-gg -----r--w'
              },
              {
                alg: ["y (L' U2 L) U (L' U' L)"],
                pattern: '-rgrr-rr- r---gg-gg -------gw'
              }
            ]
          },
          {
            name: (
              <>
                White sticker facing{' '}
                <span className="text-custom-500">Side / Front</span>
              </>
            ),
            desc: (
              <>
                Stickers on the U face are{' '}
                <span className="text-custom-500">different</span>
              </>
            ),
            algs: [
              {
                alg: ["(R U R')"],
                pattern: '--rrr-rr- w---gg-gg -r------g'
              },
              {
                alg: ["y (L' U' L)"],
                pattern: '--wrr-rr- g---gg-gg ---g----r'
              },
              {
                alg: [
                  "U' (R U R') U (R U R')",
                  "U2 (R U' R') U' (R U R')",
                  "R' U R2 U R'"
                ],
                warn: [2],
                pattern: '--rrr-rr- w---gg-gg ---r----g'
              },
              {
                alg: [
                  "y U (L' U' L) U' (L' U' L)",
                  "y U2 (L' U L) U (L' U' L)",
                  "y L U' L2' U' L"
                ],
                warn: [2],
                pattern: '--wrr-rr- g---gg-gg -g------r'
              },
              {
                alg: [
                  "R' U2 R2 U R2' U R",
                  "(R U' R') U (R U' R') U2 (R U' R')",
                  "R' U2 R2 U R'",
                  "y U L' U2 L U' y' R U R'"
                ],
                warn: [2],
                pattern: '-grrr-rr- w---gg-gg -------rg'
              },
              {
                alg: [
                  "y L U2 L2' U' L2 U' L'",
                  "y (L' U L) U' (L' U L) U2 (L' U L)",
                  "y L U2 L2' U' L",
                  "U' (R U2 R') U y (L' U' L)"
                ],
                warn: [2],
                pattern: '--wrr-rr- gr--gg-gg -----g--r'
              },
              {
                alg: ["U' (R U' R') U (R U R')"],
                pattern: '--rrr-rr- wg--gg-gg -----r--g'
              },
              {
                alg: ["y U (L' U L) U' (L' U' L)"],
                pattern: '-rwrr-rr- g---gg-gg -------gr'
              }
            ]
          }
        ]
      }
    ]
  }
]

function CFOPF2L(): React.ReactElement {
  const navigate = useNavigate()
  const { componentBg } = useThemeColors()

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
              src="/assets/cfop/landing-f2l.webp"
              alt="F2L"
              className="size-16"
            />
            First Two Layers
          </h1>
        </div>
      </header>
      {sections.map((section, i) => (
        <section key={`section-${i + 1}`} className="my-8 space-y-4">
          <p className="w-full text-center text-lg font-semibold tracking-wider text-custom-500">
            SECTION {i + 1}
          </p>
          <h2 className="text-center text-4xl font-semibold tracking-widest">
            {section.name}
          </h2>
          {section.subsections.map((subsection, j) => (
            <div key={`subsection-${j + 1}`} className="space-y-8">
              <h3 className="pt-8 text-center text-2xl font-semibold tracking-wider">
                {subsection.name}
              </h3>
              {subsection.subsubsections.map((subsubsection, k) => (
                <div key={`subsubsection-${k + 1}`}>
                  <h4 className="pt-4 text-2xl font-semibold tracking-wider">
                    {subsubsection.name}
                  </h4>
                  <p className="mt-2 text-lg text-bg-500">
                    {subsubsection.desc}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {subsubsection.algs.map(({ alg, pattern, warn }, i) => (
                      <div
                        key={i}
                        className={`flex w-full items-center gap-6 rounded-md p-4 shadow-custom ${componentBg}`}
                      >
                        <div className="rounded-md bg-bg-800/50 p-1 pb-2">
                          <Cube pattern={pattern} />
                        </div>
                        <div className="space-y-2 text-lg font-medium">
                          {alg.map((a, j) => (
                            <p
                              key={a}
                              className={
                                warn?.includes(j) === true ? 'text-red-400' : ''
                              }
                            >
                              {a}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </ModuleWrapper>
  )
}

export default CFOPF2L
