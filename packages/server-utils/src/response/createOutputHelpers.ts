import { Output, isSuccessOutputKey } from './status'
import type { OutputDefinition, OutputHelpers } from './types'

export function createOutputHelpers<
  TOutput extends OutputDefinition | 'custom'
>(output: TOutput): OutputHelpers<TOutput> {
  const helpers = {} as Record<
    string,
    (payload?: unknown) => { $status: number; payload?: unknown }
  >

  if (output === 'custom') {
    return helpers as unknown as OutputHelpers<TOutput>
  }

  for (const key of Object.keys(output)) {
    if (!isSuccessOutputKey(key)) continue

    const outputDef = Output[key]

    const status = outputDef?.$status ?? 200

    const hasPayload =
      outputDef && 'hasPayload' in outputDef
        ? (outputDef as { hasPayload: boolean }).hasPayload
        : false

    helpers[outputDef.key] = function (payload?: unknown) {
      return {
        $status: status,
        ...(hasPayload ? { payload } : {})
      }
    }
  }

  for (const key of Object.keys(Output)) {
    if (isSuccessOutputKey(key)) continue

    const outputDef = Output[key as keyof typeof Output]

    helpers[outputDef.key] =
      'hasPayload' in outputDef
        ? (payload?: unknown) => ({ $status: outputDef.$status, payload })
        : () => ({ $status: outputDef.$status })
  }

  return helpers as unknown as OutputHelpers<TOutput>
}
