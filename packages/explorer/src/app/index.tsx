import React, { useEffect, useState } from 'react'
import { create } from '@dstack-js/ipfs'
import { Stack } from '@dstack-js/lib'

export const App: React.FC = () => {
  const namespace = 'dstack'
  const [stack, setStack] = useState<Stack | null>()

  useEffect(() => {
    const run = async () => {
      const ipfs = await create({ namespace })
      const stack = await Stack.create(namespace, ipfs)
      setStack(stack)
    }

    run().catch(console.error)
  }, [])

  return stack ? <div>use window.stack</div> : <div>Initializing Stack</div>
}
