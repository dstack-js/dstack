import { MercuriusContext } from 'mercurius'

export interface RelayContext {
  namespace?: string;
}

export type Context = MercuriusContext & RelayContext;
