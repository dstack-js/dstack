import { create } from '@dstack-js/ipfs';
import { Stack } from '@dstack-js/lib';
import React, { useState } from 'react';

export const App: React.FunctionComponent<{}> = () => {
  const [ready, setReady] = useState(false);

  const init = async (): Promise<void> => {
    const ipfs = await create();
    const stack = await Stack.create('stack', ipfs);

    // @ts-expect-error
    window.stack = stack;

    setReady(true);
  };

  React.useEffect(() => {
    init();
  }, []);

  return ready ? (
    <pre>use `window.stack` to get started</pre>
  ) : (
    <h3>Initializing</h3>
  );
};
