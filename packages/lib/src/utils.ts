import { md } from 'node-forge'

export const sha256 = (data: string) => {
  return md.sha256.create().update(data).digest().toHex()
}
