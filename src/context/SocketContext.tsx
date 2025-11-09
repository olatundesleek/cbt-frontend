'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket } from '@/lib/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

/**
 * Socket.IO Provider - manages WebSocket connection for real-time features
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    if (socket?.connected) return;

    try {
      const newSocket = initializeSocket();
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });
    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  };

  const disconnect = () => {
    disconnectSocket();
    setSocket(null);
    setIsConnected(false);
  };

  // Only cleanup on unmount, don't auto-connect
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connect, disconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Hook to access Socket.IO context
 */
export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
