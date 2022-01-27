import { Stack, Peer } from '@dstack-js/lib';
import React, { useEffect, useState } from 'react';

export const Dashboard: React.FunctionComponent<{ stack: Stack }> = (props) => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [topic, setTopic] = useState<string>('date');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    props.stack.pubsub.subscribe('$store', (msg) => {
      events.push(`$store: ${msg.from} ${(msg.data as any).key}`);
      setEvents(events.slice(1).slice(-5));
    });

    const updateState = async () => {
      setPeers(await props.stack.peers());
    };

    const interval = setInterval(() => {
      updateState();
    }, 100);

    return () => {
      props.stack.pubsub.unsubscribe('$store');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    props.stack.pubsub.subscribe(topic, (msg) => {
      events.push(`${topic}: ${msg.from} ${msg.data}`);
      setEvents(events.slice(1).slice(-5));
    });

    return () => {
      props.stack.pubsub.unsubscribe(topic);
    };
  }, [topic]);

  return (
    <div>
      <pre>use `window.stack` to interact with DStack</pre>
      <br />
      Topic:
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <br />
      <button
        onClick={() =>
          props.stack.pubsub.publish(topic, new Date().toISOString())
        }
      >
        Publish event that contains date
      </button>
      <br />
      <h3>Connected Peers:</h3>
      {peers.map((peer) => (
        <li key={peer.id}>{peer.id}</li>
      ))}
      <br />
      <h3>Captured events:</h3>
      {events.map((event) => (
        <div key={event}>
          {event} <br />
        </div>
      ))}
    </div>
  );
};
