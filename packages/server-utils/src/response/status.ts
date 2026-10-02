export const Output = {
  OK: {
    $status: 200,
    kind: 'success',
    key: 'ok',
    hasPayload: true
  },
  CREATED: {
    $status: 201,
    kind: 'success',
    key: 'created',
    hasPayload: true
  },
  ACCEPTED: {
    $status: 202,
    kind: 'success',
    key: 'accepted'
  },
  NO_CONTENT: {
    $status: 204,
    kind: 'success',
    key: 'noContent'
  },
  BAD_REQUEST: {
    $status: 400,
    kind: 'error',
    key: 'badRequest',
    hasPayload: true
  },
  UNAUTHORIZED: {
    $status: 401,
    kind: 'error',
    key: 'unauthorized'
  },
  FORBIDDEN: {
    $status: 403,
    kind: 'error',
    key: 'forbidden'
  },
  NOT_FOUND: {
    $status: 404,
    kind: 'error',
    key: 'notFound'
  },
  CONFLICT: {
    $status: 409,
    kind: 'error',
    key: 'conflict'
  }
} as const satisfies Record<
  string,
  {
    $status: number
    kind: 'success' | 'error'
    key: string
    hasPayload?: true
  }
>

export type OutputType = typeof Output

export type SuccessOutputKey = {
  [K in keyof OutputType]: OutputType[K] extends { kind: 'success' } ? K : never
}[keyof OutputType]

export type ErrorOutputKey = Exclude<keyof OutputType, SuccessOutputKey>

export function isSuccessOutputKey(key: string): key is SuccessOutputKey {
  return (
    Object.prototype.hasOwnProperty.call(Output, key) &&
    Output[key as keyof OutputType].kind === 'success'
  )
}

export function getStatusMessage(status: number): string {
  const matchingKey = Object.keys(Output).find(
    key => Output[key as keyof typeof Output].$status === status
  )

  if (!matchingKey) {
    return 'Error'
  }

  return matchingKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
