/**
 * This error indicates that the attempt to export a peer identity failed due to missing private key.
 */
export class SecretIsNotAvailable extends Error {
  constructor () {
    super("attempt to export a peer identity failed due to missing private key")
  }
}

export class InvalidPubsubImplementation extends Error {
  constructor () {
    super("invalid pubsub implementation, please use gossipsub compatible pubsub")
  }
}
