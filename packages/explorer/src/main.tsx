import React, { useEffect, useState, StrictMode } from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Stack } from '@dstack-js/lib'

export const App: React.FC = () => {
  const namespace = 'explorer'
  const [stack, setStack] = useState<Stack | null>()

  useEffect(() => {
    const run = async () => {
      const stack = await Stack.create({ namespace })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.stack = stack
      setStack(stack)
    }

    run().catch(console.error)
  }, [])

  return stack ? <div>use window.stack</div> : <div>Initializing Stack</div>
}

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
