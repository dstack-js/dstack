import { Node, Stack } from '@dstack-js/lib'
import { Geohash } from './geohash'

export interface Geo {
  stack: Stack
}

export const encode = <T = any>(stack: Stack, node: Node | null, latitude: number, longitude: number, precision: number): Promise<Node<T>> => {
  const hash = Geohash
    .encode(latitude, longitude, precision)
    .split('')
    .join('.')

  return stack.node(`${node ? node.path : ''}.$geo.${hash}`)
}

export { Geohash }
