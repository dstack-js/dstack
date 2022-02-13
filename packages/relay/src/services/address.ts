const ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/
const ipv6Regex =
  /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i

export const getListenAddress = (
  protocol: 'http' | 'https',
  hostname: string,
  port: number | string
) => {
  let addr = ''

  if (hostname && ipv4Regex.test(hostname)) {
    addr += '/ip4/' + hostname + '/tcp/' + port + '/'
  } else if (hostname && ipv6Regex.test(hostname)) {
    addr += '/ip6/' + hostname + '/tcp/' + port + '/'
  } else if (ipv4Regex.test(hostname)) {
    addr += '/ip4/' + hostname + '/tcp/' + port + '/'
  } else if (ipv6Regex.test(hostname)) {
    addr += '/ip6/' + hostname + '/tcp/' + port + '/'
  } else {
    addr += '/dns4/' + hostname + '/tcp/' + port + '/'
  }

  if (protocol === 'https') addr += 'wss/'
  else addr += 'ws/'

  addr += 'p2p-webrtc-star/'

  return addr
}
