import React, { useEffect, useState, StrictMode } from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Stack, Shard, ShardKind } from '@dstack-js/lib'

declare global {
  interface Window {
    stack: Stack;
    Shard: typeof Shard;
    ShardKind: typeof ShardKind;
  }
}

export const App: React.FC = () => {
  const namespace: string = localStorage['namespace'] || 'explorer'
  const [stack, setStack] = useState<Stack | null>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let stop = () => {}

    const run = async () => {
      const stack = await Stack.create({
        namespace,
        relay: localStorage['relay']
      })
      window.stack = stack
      window.Shard = Shard
      window.ShardKind = ShardKind
      setStack(stack)
      stop = () => stack.stop().catch(console.error)
    }

    run().catch((err) => {
      alert(err)
      console.error(err)
    })

    return () => stop()
  }, [namespace])

  return stack
    ? (
    <div>
      namespace: <pre>{namespace}</pre> <br /> <code>window.stack</code>,{' '}
      <code>window.Shard</code>, <code>window.ShardKind</code>,{' '}
      <code>localStorage.namespace</code>
    </div>
      )
    : (
    <div>Initializing Stack</div>
      )
}

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
