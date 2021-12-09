import { IPFS } from 'ipfs-core'
import { CID } from 'multiformats/cid'
import { createCleartextMessage, readCleartextMessage, sign, verify } from 'openpgp'
import { App } from './app'

export class Node<T = Record<string, any>> {
  // eslint-disable-next-line no-useless-constructor
  constructor(private ipfs: IPFS, private app: App, public cid?: CID) {}

  public async get(cid?: string): Promise<T> {
    if (!this.cid || cid) throw new Error('no CID or CID string representation present')

    if (cid) {
      this.cid = CID.parse(cid)
    }

    const response = await this.ipfs.dag.get(this.cid)
    const { data, signature } = response.value

    console.log(signature)

    const signedMessage = await readCleartextMessage({
      cleartextMessage: signature
    })

    const signed = await verify({
      message: signedMessage as any,
      verificationKeys: [this.app.publicKey],
      expectSigned: true
    })

    if (JSON.stringify(data) !== signed.data) {
      throw new Error('signatureMismatch')
    }

    const resolved = this.resolve(data, 'decode')

    return resolved as T
  }

  public async put(data: T, signature?: string): Promise<T> {
    const resolved = this.resolve(data, 'encode')

    if (!signature) {
      if (!this.app.privateKey) throw new Error('signature is missing and privateKey was not specified in app')

      signature = await sign({
        message: await createCleartextMessage({ text: JSON.stringify(resolved) }),
        signingKeys: [this.app.privateKey]
      })

      console.log(signature)
    }

    this.cid = await this.ipfs.dag.put({ data: resolved, signature }, { pin: true })

    return data
  }

  private resolveValue(data: unknown, kind: 'encode' | 'decode'): unknown {
    if (kind === 'decode' && CID.isCID(data)) {
      return new Node(this.ipfs, this.app, data)
    }

    if (kind === 'encode' && data instanceof Node && data.cid) {
      return data.cid
    }

    return data
  }

  private resolve(data: unknown, kind: 'encode' | 'decode'): unknown {
    if (Array.isArray(data)) {
      return data.map((v) => {
        return this.resolveValue(v, kind)
      })
    } else if (data && typeof data === 'object') {
      return Object.entries(data).reduce(
        (data, [k, v]): any => {
          if (v.constructor === Object) {
            return this.resolve(v, kind)
          }

          v = this.resolveValue(v, kind)

          data = { ...data, [k]: v }

          return data
        },
        data
      )
    }

    return data
  }
}
