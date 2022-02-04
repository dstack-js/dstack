import { create } from '@dstack-js/ipfs';
import { Stack, Shard, ShardKind } from '@dstack-js/lib';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Dashboard } from './dashboard';

export const App: React.FunctionComponent<{}> = () => {
  const [stack, setStack] = useState<Stack | null>(null);
  const [loading, setLoading] = useState(false);
  const [namespace, setNamespace] = useState('dstack');

  const init = async (): Promise<void> => {
    setLoading(true);
    localStorage.setItem('debug', '*');

    const ipfs = await create();
    const stack = await Stack.create(namespace, ipfs);

    // @ts-expect-error
    window.stack = stack;
    // @ts-expect-error
    window.Shard = Shard;
    // @ts-expect-error
    window.ShardKind = ShardKind;

    setLoading(false);
    setStack(stack);
  };

  if (!stack) {
    return (
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Stack namespace"
          onChange={(e) => setNamespace(e.target.value)}
          value={namespace}
          focused
        />
        <LoadingButton loading={loading} onClick={init}>
          Create
        </LoadingButton>
      </Box>
    );
  }

  return <Dashboard stack={stack} />;
};
