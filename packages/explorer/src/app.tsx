import { create } from '@dstack-js/ipfs';
import { Stack } from '@dstack-js/lib';
import React, { useState } from 'react';
import { Dashboard } from './dashboard';

export const App: React.FunctionComponent<{}> = () => {
  const [stack, setStack] = useState<Stack | null>(null);
  const [fillInfo, setFillInfo] = useState(true);
  const [namespace, setNamespace] = useState('dstack');

  const init = async (): Promise<void> => {
    setFillInfo(false);
    localStorage.setItem('debug', '*');

    const ipfs = await create();
    const stack = await Stack.create(namespace, ipfs);
    stack.debug();

    // @ts-expect-error
    window.stack = stack;

    setStack(stack);
  };

  if (fillInfo) {
    return (
      <div>
        <input
          type="text"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
        ></input>
        <button onClick={init}>Start</button>
      </div>
    );
  }

  return stack ? <Dashboard stack={stack} /> : <h3>Initializing</h3>;
};
