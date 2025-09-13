import { useRailwayMapContext } from '../providers/RailwayMapProvider'

const StationCodes = ({ codes }: { codes: string[] }) => {
  const { lines } = useRailwayMapContext()

  return (
    <div className="flex items-center gap-2">
      {codes.map(code => (
        <span
          key={code}
          className="text-bg-100 rounded-full px-2.5 py-0.5 font-['LTAIdentityMedium'] text-sm"
          style={{
            backgroundColor:
              lines.find(
                line =>
                  code.startsWith(line.code.slice(0, 2)) ||
                  (code.startsWith('CG') && line.code === 'EWL') ||
                  (code.startsWith('CE') && line.code === 'CCL')
              )?.color ?? '#333'
          }}
        >
          {code}
        </span>
      ))}
    </div>
  )
}

export default StationCodes
