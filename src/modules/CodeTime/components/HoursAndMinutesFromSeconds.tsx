/* eslint-disable multiline-ternary */
import React from 'react'

export default function HoursAndMinutesFromSeconds({
  seconds
}: {
  seconds: number
}): React.ReactElement {
  return (
    <>
      {Math.floor(seconds / 60) > 0 ? (
        <>
          {Math.floor(seconds / 60)}
          <span className="pl-1 text-3xl font-normal text-bg-500">h</span>
        </>
      ) : (
        ''
      )}{' '}
      {Math.floor(seconds % 60) > 0 ? (
        <>
          {Math.floor(seconds % 60)}
          <span className="pl-1 text-3xl font-normal text-bg-500">m</span>
        </>
      ) : (
        ''
      )}{' '}
      {seconds === 0 ? 'no time' : ''}
    </>
  )
}
