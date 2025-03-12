export default function HoursAndMinutesFromSeconds({
  seconds
}: {
  seconds: number
}) {
  return (
    <>
      {Math.floor(seconds / 60) > 0 ? (
        <>
          {Math.floor(seconds / 60)}
          <span className="text-bg-500 pl-1 text-3xl font-normal">h</span>
        </>
      ) : (
        ''
      )}{' '}
      {Math.floor(seconds % 60) > 0 ? (
        <>
          {Math.floor(seconds % 60)}
          <span className="text-bg-500 pl-1 text-3xl font-normal">m</span>
        </>
      ) : (
        ''
      )}{' '}
      {seconds === 0 ? 'no time' : ''}
    </>
  )
}
