import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Initialize Socket.IO connection
 */
export const initializeSocket = (token?: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
    'http://localhost:4000';

  socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    auth: token ? { token } : undefined,
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.IO disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  return socket;
};

/**
 * Get the current socket instance
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};
