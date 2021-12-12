import { IPFS } from 'ipfs-core'
import { CID } from 'multiformats'

const transformString = (field: string) => {
  try {
    return CID.parse(field)
  } catch {}

  return field
}

const transformObject = (field: any) => {
  if (field instanceof CID) {
    return field.toString()
  }

  return field
}

export const transformField = (field: unknown) => {
  switch (typeof field) {
    case 'string':
      return transformString(field)

    case 'object':
      return transformObject(field)

    default:
      return field
  }
}

export const transformRecord = (record: Record<string, any>, ignoreCID = true): Record<string, any> => {
  return Object.entries(record)
    .reduce((p, [k, v]) => {
      if (ignoreCID && k === 'cid') {
        return p
      }

      return { ...p, [k]: transformField(v) }
    }, record)
}

export const resolveRecord = async (ipfs: IPFS, record: Record<string, unknown>) => {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(record)
        .map(async ([k, v]) => {
          if (k === 'cid') {
            return [k, v]
          }

          if (v instanceof CID) {
            const { value } = await ipfs.dag.get(v)

            v = value
          }

          return [k, v]
        })
    )
  )
}
