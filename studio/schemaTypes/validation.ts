import type {CustomValidator} from 'sanity'
import {API_VERSION, MB} from './constants'

type AssetValue = {asset?: {_ref?: string}} | undefined

function formatMb(bytes: number) {
  return `${(bytes / MB).toFixed(1)} MB`
}

/**
 * Builds a validator that looks up the uploaded file's size and
 * complains when it is above `limit`. Used both as a hard error and a soft warning.
 */
export function assetSizeLimit(limit: number, message: string): CustomValidator<AssetValue> {
  return async (value, context) => {
    const ref = value?.asset?._ref
    if (!ref) return true
    const client = context.getClient({apiVersion: API_VERSION})
    const size = await client.fetch<number | null>(`*[_id == $id][0].size`, {id: ref})
    if (typeof size === 'number' && size > limit) {
      return `${message} (this file is ${formatMb(size)}; the limit is ${formatMb(limit)}).`
    }
    return true
  }
}

/** Accepts 24-hour times such as 09:00 or 16:30. */
export const timeOfDay: CustomValidator<string | undefined> = (value) => {
  if (!value) return true
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) || 'Use 24-hour format, for example 09:00 or 16:30.'
}
