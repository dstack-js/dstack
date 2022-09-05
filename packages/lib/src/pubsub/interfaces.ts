import { Peer } from "../network"

export interface PublishMetadata {
  topic: string
  data: Uint8Array
  recipients: Peer[]
}

export interface SubscriptionEvent<T = Uint8Array> {
  topic: string
  /**
   * defined if message was signed
   */
  from?: Peer | null
  data: T
}

export type SubscriptionEventListener<T = Uint8Array> = (event: SubscriptionEvent<T>) => void
