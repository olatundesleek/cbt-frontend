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
import { getSocket, initializeSocket, disconnectSocket } from '@/lib/socket';
import { useUserStore } from '@/store/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '@/components/modal';
import { AUTH_SESSION_STORAGE_KEY } from '@/lib/constants';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: <T>(event: string, payload?: T) => void;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  off: (event: string, listener?: (...args: unknown[]) => void) => void;
}

interface ForceLogoutPayload {
  reason?: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const role = useUserStore((state) => state.role);
  const setRole = useUserStore((state) => state.setRole);
  const resetUser = useUserStore((state) => state.reset);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [forceLogoutState, setForceLogoutState] = useState<{
    reason: string;
    remainingSeconds: number;
  } | null>(null);
  const forceLogoutHandledRef = useRef(false);
  const forceLogoutCompletedRef = useRef(false);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      const newSocket = initializeSocket();
      socketRef.current = newSocket;

      setSocketInstance(newSocket);

    } catch (error) {
      console.error('❌ Failed to connect socket:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (role) return;

    const storedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!storedSession) return;

    try {
      const parsedSession = JSON.parse(storedSession) as {
        role?: 'admin' | 'teacher' | 'student';
      };

      if (
        parsedSession.role === 'admin' ||
        parsedSession.role === 'teacher' ||
        parsedSession.role === 'student'
      ) {
        setRole(parsedSession.role);
      }
    } catch {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
  }, [role, setRole]);

  useEffect(() => {
    if (role) {
      const currentSocket = getSocket() ?? initializeSocket();
      socketRef.current = currentSocket;
      setSocketInstance(currentSocket);
      setIsConnected(currentSocket.connected);
    } else if (!role && socketRef.current) {
      disconnect();
    }
  }, [disconnect, role]);

  useEffect(() => {
    if (!socketInstance) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = (error: Error) => {
      console.error('❌ Socket connection error:', error.message);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
    };
  }, [socketInstance]);

  useEffect(() => {
    if (!socketInstance || !role) return;

    const handleForceLogout = (payload?: unknown) => {
      if (forceLogoutHandledRef.current) return;

      forceLogoutHandledRef.current = true;
      forceLogoutCompletedRef.current = false;
      const forceLogoutPayload = (payload ?? {}) as ForceLogoutPayload;
      setForceLogoutState({
        reason:
          forceLogoutPayload.reason ||
          'Your session was ended by an administrator.',
        remainingSeconds: 5,
      });
    };

    const forceLogoutEvents = ['force-logout', 'force_logout', 'forceLogout'];
    forceLogoutEvents.forEach((eventName) => {
      socketInstance.on(eventName, handleForceLogout);
    });

    return () => {
      forceLogoutEvents.forEach((eventName) => {
        socketInstance.off(eventName, handleForceLogout);
      });
    };
  }, [role, socketInstance]);

  useEffect(() => {
    if (!forceLogoutState) return;

    if (forceLogoutState.remainingSeconds === 0) {
      if (forceLogoutCompletedRef.current) return;
      forceLogoutCompletedRef.current = true;

      const completeForceLogout = async () => {
        try {
          await fetch('/api/auth/client-logout', {
            method: 'POST',
            credentials: 'include',
          });
        } finally {
          queryClient.clear();
          localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
          resetUser();
          disconnect();
          toast.error(forceLogoutState.reason, {
            id: 'force-logout-notification',
          });
          router.replace(
            role === 'admin' || role === 'teacher' ? '/admin/login' : '/',
          );
        }
      };

      void completeForceLogout();
      return;
    }

    const timer = window.setTimeout(() => {
      setForceLogoutState((current) =>
        current
          ? {
              ...current,
              remainingSeconds: current.remainingSeconds - 1,
            }
          : null,
      );
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [disconnect, forceLogoutState, queryClient, resetUser, role, router]);

  const emit: SocketContextType['emit'] = useCallback((event, payload) => {
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

  return (
    <>
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

      <Modal
        modalIsOpen={Boolean(forceLogoutState)}
        dismissible={false}
        setModalIsOpen={() => undefined}
      >
        {forceLogoutState && (
          <div className='space-y-4 text-center'>
            <h2 className='text-xl font-semibold text-neutral-900'>
              Session ended
            </h2>
            <p className='text-sm text-neutral-600'>
              {forceLogoutState.reason}
            </p>
            <p className='text-sm font-medium text-error-700'>
              Redirecting to login in {forceLogoutState.remainingSeconds} second
              {forceLogoutState.remainingSeconds === 1 ? '' : 's'}...
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('useSocket must be used within a SocketProvider');
  return context;
}
