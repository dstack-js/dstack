import { DualDHT, EventTypes, ValueEvent } from "@libp2p/interface-dht"
import { decode, encode } from "cborg"
import type { KValue } from "./interfaces"
import { KadDHT } from "@libp2p/kad-dht"
import { Stack } from "../stack"
import all from "it-all"

export class KV {
  private dht: DualDHT
  private store: Record<string, KValue> = {}

  private constructor (private stack: Stack, dht?: DualDHT) {
    this.dht = dht || stack.network.libp2p.dht
  }

  private encode (key: string, value: unknown): {data: KValue, key: Uint8Array; value: Uint8Array} {
    const data: KValue = {
      key,
      value,
      createdAt: Date.now(),
      setBy: this.stack.network.libp2p.peerId.toString()
    }

    return { data, key: new TextEncoder().encode(key), value: encode(data) }
  }

  public async set (key: string, value: unknown): Promise<void> {
    const encoded = this.encode(key, value)
    this.store[key] = encoded.data

    return new Promise((resolve, reject) => {
      all(this.dht.put(encoded.key, encoded.value))
        .catch(reject)
    })
  }

  public async get <T = any> (key: string): Promise<KValue<T> | null> {
    const encoded = this.encode(key, undefined)
    const output = await all(this.dht.get(encoded.key))

    const results = output
      .filter(({ type }) => type === EventTypes.VALUE)
      .map((data) => {
        const payload = data as ValueEvent
        return decode(payload.value) as KValue<T>
      })
      .sort((a, b) => b.createdAt - a.createdAt)

    return results[0] || null
  }

  public static create (stack: Stack, namespace?: string) {
    const dht = namespace &&
      new KadDHT({
        protocolPrefix: namespace
      })

    return new KV(stack, dht)
  }
}

export * from "./interfaces"
