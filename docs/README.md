# DStack

<img width="16" src="./static/img/logo.svg" /> Technology stack as a library for developing semi-decentralized web applications

[![npm-badge]][npm] [![Changelog][changelog-badge]][changelog] [![issues-badge]][issues] [![license-badge]][license]
[![FOSSA Status][fossa-badge]][fossa] [![Discord][discord-badge]][discord]

Checkout [Peerchat](https://dstack.dev/blog/peerchat) demo

| [Explorer](https://explorer.dstack.dev)                                                                                                                              | [Docs](https://dstack.dev)                                                                                                                                            | [CI](https://github.com/dstack-js/dstack/actions/workflows/nx.yaml)                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Netlify Status](https://api.netlify.com/api/v1/badges/995efbf9-cafc-4354-b597-44a13e872d34/deploy-status)](https://app.netlify.com/sites/dstack-explorer/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/aa98407a-eb62-401d-a403-4ea91e55d37b/deploy-status)](https://app.netlify.com/sites/zen-kirch-ed73c4/deploys) | [![CI](https://github.com/dstack-js/dstack/actions/workflows/nx.yaml/badge.svg?branch=main)](https://github.com/dstack-js/dstack/actions/workflows/nx.yaml) |

## Getting started

See [Tutorial](https://dstack.dev/docs/intro) to get started using DStack in your dapp

## Introduction

DStack was created to bring together some of the popular libraries/technologies (like [IPFS](https://ipfs.io)) for the decentralized web into a single ecosystem

## What DStack offers

DStack simplifies IPFS JavaScript API for application development usage

DStack provides:

- Store API
- Shard API
- PubSub API
- Relay

### Tell others that you use DStack

Badge:

[![dstack](https://dstack.dev/img/badge.svg)](https://dstack.dev)

```markdown
[![dstack](https://dstack.dev/img/badge.svg)](https://dstack.dev)
```

## Workspace

DStack workspace is managed by [nx.dev](https://nx.dev)

### Packages

- [lib](../packages/lib) - Core library
- [relay](../packages/relay) - Relay
- [ipfs](../packages/ipfs) - IPFS

### Commands

Build packages:

```console
yarn build
```

[license]: https://github.com/dstack-js/dstack/blob/main/LICENSE
[license-badge]: https://img.shields.io/github/license/dstack-js/dstack
[issues]: https://github.com/dstack-js/dstack/issues
[issues-badge]: https://img.shields.io/github/issues/dstack-js/dstack
[npm]: https://www.npmjs.com/package/@dstack-js/lib
[npm-badge]: https://img.shields.io/npm/v/@dstack-js/lib
[ci-badge]: https://github.com/dstack-js/dstack/actions/workflows/nx.yaml/badge.svg
[ci]: https://github.com/dstack-js/dstack/actions/workflows/nx.yaml
[fossa-badge]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdstack-js%2Fdstack.svg?type=shield
[fossa]: https://app.fossa.com/projects/git%2Bgithub.com%2Fdstack-js%2Fdstack
[discord-badge]: https://discordapp.com/api/guilds/890305580139446322/widget.png?style=shield
[discord]: https://discord.link/dstack
[changelog-badge]: https://img.shields.io/badge/DStack-changelog-blue
[changelog]: https://dstack.dev/changelog

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdstack-js%2Fdstack.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdstack-js%2Fdstack?ref=badge_large)
