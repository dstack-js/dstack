import { create } from '@dstack-js/ipfs';
import { Stack } from '@dstack-js/lib';
import React from 'react';

export const App: React.FunctionComponent<{}> = () => {
  const init = async (): Promise<void> => {
    const ipfs = await create();
    const stack = Stack.create('stack', ipfs);
  };

  React.useEffect(() => {
    init();
  }, []);

  return <h1>Hello</h1>;
};
