/* eslint-disable multiline-ternary */
import React from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'

export default function UniversityAnalytics(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="University Analytics"
        desc="See which universities are the best for you."
      />
      <div className="mt-6 grid w-full flex-1 grid-cols-4 grid-rows-3 gap-6 overflow-y-auto pb-6">
        <section className="col-span-4 row-span-4 flex h-full w-full flex-col gap-4 rounded-lg bg-neutral-800/50 p-6">
          <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="tabler:table" className="text-3xl" />
            <span className="ml-2">All Universities</span>
          </h1>
          <div className="overflow-x-auto">
            <table className="table table-pin-rows table-pin-cols table-lg">
              <thead>
                <tr className="bg-neutral-800 text-base">
                  <th className="bg-neutral-800">Name</th>
                  <td>Location</td>
                  <td>QS Ranking</td>
                  <td>THE Ranking</td>
                  <td>Website</td>
                  <td>Image</td>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'Asian Pacific University',
                    'Kuala Lumpur, Malaysia',
                    '621-630',
                    '',
                    'https://www.apu.edu.my/',
                    'https://www.apu.edu.my/sites/default/files/lifeatapu_apu.jpg'
                  ],
                  [
                    'Crescendo International College',
                    'Johor, Malaysia',
                    '-',
                    '-',
                    'https://crescendo.edu.my/',
                    'https://s3-ap-southeast-1.amazonaws.com/s3.prod.public.ue.intl/unienrol.com/campus/v2/CRESCENDO/DESA+CEMERLANG+CAMPUS/Campus+_+Surroundings/01a_Crescendo_International_College_Desa_Cemerlang_Main_Entrance_of_Cresendo_International_College.png'
                  ],
                  [
                    '銘傳大學',
                    'Taipei, Taiwan',
                    '-',
                    '-',
                    'https://www.mcu.edu.tw/',
                    'https://www.overseas.edu.tw/wp-content/uploads/2020/10/%E6%A1%83%E5%9C%92%E9%8A%98%E5%9C%92-scaled.jpg'
                  ],
                  [
                    'Curtin University Malaysia',
                    'Sarawak, Malaysia',
                    '183',
                    '-',
                    'https://www.curtin.edu.my/',
                    'https://www.curtin.edu.my/wp-content/uploads/2019/10/curtin-malaysia-1.jpg'
                  ],
                  [
                    'UCSI University',
                    'Kuala Lumpur, Malaysia',
                    '300',
                    '-',
                    'https://www.ucsiuniversity.edu.my/',
                    'https://www.ucsiuniversity.edu.my/sites/default/files/2019-10/ucsi-university-kuala-lumpur-campus.jpg'
                  ],
                  [
                    'Kolej Universiti Tunku Abdul Rahman (TARC)',
                    'Kuala Lumpur, Malaysia',
                    '-',
                    '-',
                    'https://www.tarc.edu.my/',
                    'https://www.tarc.edu.my/wp-content/uploads/2019/12/kl-campus.jpg'
                  ],
                  [
                    'Universiti Tunku Abdul Rahman (UTAR)',
                    'Kuala Lumpur, Malaysia',
                    '801 - 850',
                    '-',
                    'https://study.utar.edu.my/',
                    'https://study.utar.edu.my/images/utar-logo.png'
                  ],
                  [
                    'Teeside University',
                    'Middlesbrough, United Kingdom',
                    '601 - 650',
                    '1001 - 1200',
                    'https://www.tees.ac.uk/',
                    'https://www.tees.ac.uk/images/teesside-university-logo.png'
                  ],
                  [
                    'Heriot-Watt University',
                    'Edinburgh, United Kingdom',
                    '351 - 400',
                    '601 - 800',
                    'https://www.hw.ac.uk/',
                    'https://www.hw.ac.uk/images/brand/logo.png'
                  ],
                  [
                    "Taylor's University",
                    'Selangor, Malaysia',
                    '601 - 650',
                    '-',
                    'https://university.taylors.edu.my/',
                    'https://university.taylors.edu.my/images/default-source/default-album/tu-campus-1.jpg?sfvrsn=2'
                  ],
                  [
                    'Raffles University',
                    'Johor, Malaysia',
                    '-',
                    '-',
                    'https://raffles-university.edu.my/',
                    'https://raffles-university.edu.my/wp-content/uploads/2019/09/raffles-university.jpg'
                  ],
                  [
                    'University of Nottingham',
                    'Selangor, Malaysia',
                    '99',
                    '-',
                    'https://www.nottingham.edu.my/',
                    'https://www.nottingham.edu.my/Images/UNMC-Logo-2019.png'
                  ],
                  [
                    'Sunway College Johor Bahru',
                    'Johor, Malaysia',
                    '-',
                    '-',
                    'https://college.sunway.edu.my/',
                    'https://college.sunway.edu.my/sites/default/files/2019-10/SCJB%20-%20Main%20Entrance.jpg'
                  ],
                  [
                    'Kaplan Singapore',
                    'Singapore',
                    '-',
                    '-',
                    'https://www.kaplan.com.sg/',
                    'https://www.kaplan.com.sg/wp-content/uploads/2019/10/IMG_20191010_114724.jpg'
                  ],
                  [
                    'Xiamen University Malaysia',
                    'Selangor, Malaysia',
                    '-',
                    '-',
                    'https://www.xmu.edu.my/',
                    'https://www.xmu.edu.my/wp-content/uploads/2019/10/IMG_20191010_114724.jpg'
                  ],
                  [
                    'Swinburne University of Technology',
                    'Sarawak, Malaysia',
                    '-',
                    '-',
                    'https://www.swinburne.edu.my/',
                    'https://www.swinburne.edu.my/wp-content/uploads/2019/10/IMG_20191010_114724.jpg'
                  ],
                  [
                    'Tunku Abdul Rahman University of Management and Technology (TARUMT)',
                    'Sabah, Malaysia',
                    '-',
                    '-',
                    'https://www.tarumt.edu.my/',
                    'https://www.tarumt.edu.my/wp-content/uploads/2019/10/IMG_20191010_114724.jpg'
                  ],
                  [
                    'Griffith University',
                    'Queensland, Australia',
                    '251 - 300',
                    '201 - 250',
                    'https://www.griffith.edu.au/',
                    'https://www.griffith.edu.au/__data/assets/image/0004/1114689/Griffith-University-logo.png'
                  ],
                  [
                    'University of Waikato',
                    'Hamilton, New Zealand',
                    '401 - 500',
                    '401 - 500',
                    'https://www.waikato.ac.nz/',
                    'https://www.waikato.ac.nz/__data/assets/image/0005/106125/University-of-Waikato-logo.png'
                  ],
                  [
                    'INTI International University & Colleges',
                    'Malaysia',
                    '-',
                    '-',
                    'https://newinti.edu.my/',
                    'https://newinti.edu.my/wp-content/uploads/2019/10/INTI-Logo-2019.png'
                  ],
                  [
                    'New Era University College',
                    'Malaysia',
                    '-',
                    '-',
                    'https://www.newera.edu.my/',
                    'https://www.newera.edu.my/wp-content/uploads/2019/10/INTI-Logo-2019.png'
                  ],
                  [
                    'SUNWAY Univeristy',
                    'Malaysia',
                    '-',
                    '-',
                    'https://university.sunway.edu.my/',
                    'https://university.sunway.edu.my/sites/default/files/2019-10/SU%20-%20Main%20Entrance.jpg'
                  ]
                ].map((e, i) => (
                  <tr key={e[0]} className="text-neutral-400">
                    {e.map((e, i) =>
                      i ? (
                        <td key={i}>
                          {i !== 5 ? e : <img src={e} className="w-72" />}
                        </td>
                      ) : (
                        <th className="bg-neutral-800" key={i}>
                          {e}
                        </th>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  )
}
