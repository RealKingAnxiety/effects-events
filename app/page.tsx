'use client';

import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

// Challenge 1: Fix Reconnecting
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    console.log(`✅ Connecting to "${roomId}" room...`);
    return () => console.log(`❌ Disconnected from "${roomId}" room.`);
  }, [roomId]);

  return <h2>Welcome to the {roomId} room!</h2>;
}

// Challenge 2: Fix Freezing Counter
function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="challenge">
      <h2>2. Fix Freezing Counter</h2>
      <h1>Count: {count}</h1>
      <p>
        Increment by:
        <button onClick={() => setIncrement(i => i - 1)}>-</button>
        <b>{increment}</b>
        <button onClick={() => setIncrement(i => i + 1)}>+</button>
      </p>
    </div>
  );
}

// Challenge 3: Fix Non-Adjustable Delay
function AdjustableTimer() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);

  const onTick = useEffectEvent(() => {
    setCount(c => c + 1);
  });

  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);

  return (
    <div className="challenge">
      <h2>3. Fix Non-Adjustable Delay</h2>
      <h1>Count: {count}</h1>
      <p>
        Delay: 
        <button onClick={() => setDelay(d => Math.max(100, d - 100))}>-100ms</button>
        <b>{delay}ms</b>
        <button onClick={() => setDelay(d => d + 100)}>+100ms</button>
      </p>
    </div>
  );
}

// Challenge 4: Fix Delayed Notification
function ChatRoomWithNotification({ roomId, theme }: { roomId: string; theme: string }) {
  const onConnected = useEffectEvent((connectedRoomId: string) => {
    showNotification(`Welcome to ${connectedRoomId}!`, theme);
  });

  useEffect(() => {
    const connection = createConnection('https://localhost:1234', roomId);
    connection.on('connected', () => {
      setTimeout(() => onConnected(roomId), 1500);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h2>Welcome to the {roomId} room! ({theme})</h2>;
}

function showNotification(message: string, theme: string) {
  console.log(`[${theme.toUpperCase()}] ${message}`);
}

function createConnection(serverUrl: string, roomId: string) {
  return {
    connect: () => console.log(`Connecting to ${roomId}...`),
    disconnect: () => console.log(`Disconnecting from ${roomId}...`),
    on: (event: string, callback: () => void) => {
      if (event === 'connected') setTimeout(callback, 500);
    }
  };
}

export default function EffectsEvents() {
  const [roomId, setRoomId] = useState('general');
  const [theme, setTheme] = useState('light');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-16">Separating Events from Effects</h1>

        <div className="space-y-16">
          {/* Challenge 1 */}
          <div className="challenge">
            <h2>1. Fix Reconnecting</h2>
            <select value={roomId} onChange={e => setRoomId(e.target.value)}>
              <option value="general">general</option>
              <option value="travel">travel</option>
              <option value="music">music</option>
            </select>
            <ChatRoom roomId={roomId} />
          </div>

          <Timer />
          <AdjustableTimer />

          {/* Challenge 4 */}
          <div className="challenge">
            <h2>4. Fix Delayed Notification</h2>
            <label>
              <input type="checkbox" checked={theme === 'dark'} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />
              Dark Theme
            </label>
            <ChatRoomWithNotification roomId={roomId} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}