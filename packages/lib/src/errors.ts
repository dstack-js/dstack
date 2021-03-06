export class TimeoutError extends Error {
  constructor() {
    super('timeout')
  }
}

export class UnknownShardKindError extends Error {
  constructor() {
    super('unknownShardKind')
  }
}

export class InvalidShardPathError extends Error {
  constructor(extensions: any = 'invalidShardPath') {
    super(extensions)
  }
}

export class PeerUnreachableError extends Error {
  constructor(extensions: any = 'peerUnreachable') {
    super(extensions)
  }
}
