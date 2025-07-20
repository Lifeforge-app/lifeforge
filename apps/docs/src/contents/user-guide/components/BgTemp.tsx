import { useState } from 'react'

const COLORS = ['bg-slate', 'bg-gray', 'bg-zinc', 'bg-neutral', 'bg-stone']

function BgTemp() {
  const [bgTemp, setBgTemp] = useState<string>('bg-slate')

  return (
    <div className="mt-6 flex w-full min-w-0">
      <div className="w-full rounded-md bg-zinc-800/50 p-4">
        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <h3 className="w-full text-left text-xl font-semibold">
            Background Temperature Preview
          </h3>
          <div className="flex items-center gap-4 p-2">
            {COLORS.map((color, index) => (
              <button
                key={index}
                className={`size-6 rounded-full ${color} bg-bg-500 ${
                  bgTemp === color
                    ? 'ring-offset-bg-950 ring-2 ring-zinc-100 ring-offset-2'
                    : ''
                }`}
                onClick={() => {
                  setBgTemp(color)
                }}
              ></button>
            ))}
          </div>
        </div>
        <img
          key={bgTemp}
          alt=""
          className="mt-4 w-full rounded-md"
          src={`/assets/bgTemp/${COLORS.indexOf(bgTemp) + 1}.png`}
        />
      </div>
    </div>
  )
}

export default BgTemp
