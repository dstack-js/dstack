import { create } from "@dstack-js/ipfs"
import { Store, Shard } from "@dstack-js/lib"
import { CID } from "multiformats/cid"

const run = async () => {
  const ipfs = await create({ config: { Addresses: { Swarm: ['/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star/', '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/', '/dns4/wrtc-star1.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/'] }, Bootstrap: [] } })
  // @ts-ignore
  window.ipfs = ipfs
  // @ts-ignore
  window.CID = CID

  const { addresses } = await ipfs.id()

  for (const address of addresses) {
    console.log(address.toString())
  }

  const store = new Store(ipfs, 'demo')
  // @ts-ignore
  window.store = store
  // @ts-ignore
  window.Shard = Shard
}


run()
