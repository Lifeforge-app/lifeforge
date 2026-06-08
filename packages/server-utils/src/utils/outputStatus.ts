export const Output = {
  OK: {
    $status: 200,
    hasPayload: true
  },
  CREATED: {
    $status: 201,
    hasPayload: true
  },
  ACCEPTED: {
    $status: 202
  },
  NO_CONTENT: {
    $status: 204
  },
  BAD_REQUEST: {
    $status: 400,
    hasPayload: true
  },
  UNAUTHORIZED: {
    $status: 401
  },
  FORBIDDEN: {
    $status: 403
  },
  NOT_FOUND: {
    $status: 404
  },
  CONFLICT: {
    $status: 409
  }
} as const satisfies Record<
  string,
  {
    $status: number
    hasPayload?: true
  }
>

export type OutputType = typeof Output

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
