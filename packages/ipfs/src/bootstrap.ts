import { request, gql } from 'graphql-request'

export const bootstrap = async (
  namespace: string,
  relay = 'https://relay.dstack.dev:443/graphql'
) => {
  const url = new URL(relay)

  const query = gql`
    query Bootstrap($protocol: Protocol!, $hostname: String!, $port: Int!) {
      listen(protocol: $protocol, hostname: $hostname, port: $port)
      peers(
        randomize: true
        protocol: $protocol
        hostname: $hostname
        port: $port
      )
    }
  `

  const { listen, peers } = await request<{
    listen: string[];
    peers: string[];
    namespace: string;
  }>(
    relay,
    query,
    {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: Number(url.port || '443')
    },
    { 'x-dstack-namespace': namespace }
  )

  return { listen, peers }
}
