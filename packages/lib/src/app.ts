import { CID } from 'multiformats/cid'
import { PrivateKey, PublicKey } from 'openpgp'

export interface AppUser {
  name: string
  email: string
}

export interface AppParameters {
  name: string
  user: AppUser
}

export interface App {
  cid: CID
  params: AppParameters
  publicKey: PublicKey
  privateKey?: PrivateKey
}
