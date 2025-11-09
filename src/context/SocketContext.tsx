// 'use client';

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
//   useSyncExternalStore,
// } from 'react';
// import { Socket } from 'socket.io-client';
// import { initializeSocket, disconnectSocket } from '@/lib/socket';

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
//   connect: () => void;
//   disconnect: () => void;
//   emit: <T>(event: string, payload?: T) => void;
//   on: (event: string, listener: (...args: unknown[]) => void) => void;
//   off: (event: string, listener?: (...args: unknown[]) => void) => void;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// /**
//  * Socket.IO Provider - manages WebSocket connection for real-time features
//  */
// export function SocketProvider({ children }: { children: React.ReactNode }) {
//   const socketRef = useRef<Socket | null>(null);
//   const subscribersRef = useRef(new Set<() => void>());
//   const [internalConnected, setInternalConnected] = useState(false);

//   const notify = () => {
//     for (const cb of subscribersRef.current) cb();
//   };

//   const attachLifecycleListeners = useCallback((s: Socket) => {
//     s.on('connect', () => {
//       setInternalConnected(true);
//       notify();
//     });
//     s.on('disconnect', () => {
//       setInternalConnected(false);
//       notify();
//     });
//     s.on('reconnect', () => {
//       notify();
//     });
//     s.on('connect_error', (err) => {
//       console.error('Socket connect_error', err.message);
//     });
//   }, []);

//   const connect = useCallback(() => {
//     const existing = socketRef.current;
//     if (existing?.connected) return;
//     try {
//       const newSocket = initializeSocket();
//       socketRef.current = newSocket;
//       attachLifecycleListeners(newSocket);
//       notify();
//     } catch (error) {
//       console.error('Failed to connect socket:', error);
//     }
//   }, [attachLifecycleListeners]);

//   const disconnect = useCallback(() => {
//     disconnectSocket();
//     socketRef.current = null;
//     setInternalConnected(false);
//     notify();
//   }, []);

//   // External store subscription hooks for stability
//   const subscribe = useCallback((listener: () => void) => {
//     subscribersRef.current.add(listener);
//     return () => subscribersRef.current.delete(listener);
//   }, []);

//   const getSnapshot = useCallback(
//     () => ({
//       socket: socketRef.current,
//       isConnected: internalConnected,
//     }),
//     [internalConnected],
//   );

//   const { socket, isConnected } = useSyncExternalStore(
//     subscribe,
//     getSnapshot,
//     getSnapshot,
//   );

//   const emit: SocketContextType['emit'] = useCallback((event, payload) => {
//     socketRef.current?.emit(event, payload);
//   }, []);

//   const on: SocketContextType['on'] = useCallback((event, listener) => {
//     socketRef.current?.on(event, listener);
//   }, []);

//   const off: SocketContextType['off'] = useCallback((event, listener) => {
//     const s = socketRef.current;
//     if (!s) return;
//     if (listener) s.off(event, listener);
//     else s.removeAllListeners(event);
//   }, []);

//   useEffect(() => () => disconnect(), [disconnect]);

//   return (
//     <SocketContext.Provider
//       value={{ socket, isConnected, connect, disconnect, emit, on, off }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// }

// /**
//  * Hook to access Socket.IO context
//  */
// export function useSocket(): SocketContextType {
//   const context = useContext(SocketContext);
//   if (context === undefined) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return context;
// }

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket } from '@/lib/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: <T>(event: string, payload?: T) => void;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  off: (event: string, listener?: (...args: unknown[]) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  const connect = useCallback(() => {
    console.log('🔌 connect() called', {
      alreadyConnected: socketRef.current?.connected,
    });
    if (socketRef.current?.connected) {
      console.log('✅ Already connected');
      return;
    }

    try {
      console.log('⚡ Initializing socket...');
      const newSocket = initializeSocket();
      socketRef.current = newSocket;

      setSocketInstance(newSocket);

      // Attach basic lifecycle listeners
      newSocket.on('connect', () => {
        console.log('✅ Socket connected!', newSocket.id);
        setIsConnected(true);
      });
      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });
      newSocket.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
      });

      // Debug: Log ALL incoming events
      newSocket.onAny((eventName, ...args) => {
        console.log('📥 Received event:', eventName, args);
      });
    } catch (error) {
      console.error('❌ Failed to connect socket:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const emit: SocketContextType['emit'] = useCallback((event, payload) => {
    console.log('📤 Emitting event:', event, payload);
    socketRef.current?.emit(event, payload);
  }, []);

  const on: SocketContextType['on'] = useCallback((event, listener) => {
    socketRef.current?.on(event, listener);
  }, []);

  const off: SocketContextType['off'] = useCallback((event, listener) => {
    const s = socketRef.current;
    if (!s) return;
    if (listener) s.off(event, listener);
    else s.removeAllListeners(event);
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        isConnected,
        connect,
        disconnect,
        emit,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('useSocket must be used within a SocketProvider');
  return context;
}
