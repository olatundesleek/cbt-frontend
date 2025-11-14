import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';

interface UseExamSessionSocketOptions {
  /** Auto connect socket if not already */
  autoConnect?: boolean;
  /** Whether to auto join room on mount */
  autoJoin?: boolean;
}

interface TimerState {
  totalSeconds: number | null;
  remainingSeconds: number | null;
  startedAt?: string; // ISO timestamp from server
}

interface UseExamSessionSocketResult extends TimerState {
  join: () => void;
  leave: () => void;
  finish: () => void;
  isJoined: boolean;
  lastEventTs?: number;
}

/**
 * Hook to manage exam/test session socket lifecycle and timer events.
 * Server events expected:
 *  - test_started { sessionId, startedAt, durationSeconds }
 *  - time_left { sessionId, remainingSeconds, totalSeconds }
 *  - time_up { sessionId, reason }
 * Client emits:
 *  - join { sessionId }
 */
export function useExamSessionSocket(
  sessionId: number | string | null,
  options: UseExamSessionSocketOptions = {},
): UseExamSessionSocketResult {
  const { autoConnect = true, autoJoin = true } = options;
  const { connect, emit, on, off, isConnected } = useSocket();
  const [isJoined, setIsJoined] = useState(false);
  const [timer, setTimer] = useState<TimerState>({
    totalSeconds: null,
    remainingSeconds: null,
  });
  const [lastEventTs, setLastEventTs] = useState<number | undefined>(undefined);
  const sessionIdRef = useRef(sessionId);

  // Keep ref synced
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Connect on demand
  useEffect(() => {
    if (autoConnect && !isConnected) {
      connect();
    }
  }, [autoConnect, isConnected, connect]);

  const join = useCallback(() => {
    if (!sessionIdRef.current || !isConnected) {
      console.warn('⚠️ Cannot join - missing sessionId or not connected');
      return;
    }

    // Backend expects a single argument: sessionId (not an object)
    emit('join_session', sessionIdRef.current);
  }, [emit, isConnected]);

  const leave = useCallback(() => {
    if (!sessionIdRef.current || !isConnected) return;
    // Backend expects `leave_session` with sessionId as single arg
    emit('leave_session', sessionIdRef.current);
    setIsJoined(false);
  }, [emit, isConnected]);

  const finish = useCallback(() => {
    if (!sessionIdRef.current || !isConnected) return;
    emit('session:finish', { sessionId: sessionIdRef.current });
  }, [emit, isConnected]);

  // Re-join on reconnect
  useEffect(() => {
    const handleReconnect = () => {
      if (sessionIdRef.current && isJoined) {
        join();
      }
    };
    on('reconnect', handleReconnect);
    return () => off('reconnect', handleReconnect);
  }, [on, off, join, isJoined]);

  // Server event listeners
  // Backend emits minimal payloads:
  // test_started: { sessionId, testId }
  // time_left: { sessionId, timeLeft } // timeLeft in milliseconds
  // time_up: { sessionId, score?, reason? }
  type TestStartedPayload = {
    sessionId: number | string;
    testId: number | string;
  };
  type TimeLeftPayload = {
    sessionId: number | string;
    timeLeft: number; // milliseconds remaining
  };
  type TimeUpPayload = {
    sessionId: number | string;
    score?: number;
    reason?: 'timeout' | 'submitted' | 'force' | string;
  };
  useEffect(() => {
    const handleTestStarted = (payload: unknown) => {
      const p = payload as TestStartedPayload;
      if (p.sessionId !== sessionIdRef.current) return;
      setIsJoined(true);
      // Backend doesn't send duration here; timer will update on time_left
      setLastEventTs(Date.now());
    };
    const handleTimeLeft = (payload: unknown) => {
      const p = payload as TimeLeftPayload;
      if (p.sessionId !== sessionIdRef.current) return;
      setTimer((prev) => ({
        ...prev,
        // Keep totalSeconds as-is (unknown from server right now)
        totalSeconds: prev.totalSeconds ?? null,
        remainingSeconds: Math.max(0, Math.ceil((p.timeLeft ?? 0) / 1000)),
      }));
      setLastEventTs(Date.now());
    };
    const handleTimeUp = (payload: unknown) => {
      const p = payload as TimeUpPayload;
      if (p.sessionId !== sessionIdRef.current) return;
      setTimer((prev) => ({ ...prev, remainingSeconds: 0 }));
      setIsJoined(false);
    };

    on('test_started', (payload) => {
      handleTestStarted(payload);
    });
    on('time_left', (payload) => {
      handleTimeLeft(payload);
    });
    on('time_up', (payload) => {
      handleTimeUp(payload);
    });
    return () => {
      off('test_started', handleTestStarted);
      off('time_left', handleTimeLeft);
      off('time_up', handleTimeUp);
    };
  }, [on, off]);

  // Auto join when sessionId available
  useEffect(() => {
    if (autoJoin && sessionId && isConnected && !isJoined) {
      join();
    }
  }, [autoJoin, sessionId, isConnected, isJoined, join]);

  return {
    ...timer,
    join,
    leave,
    finish,
    isJoined,
    lastEventTs,
  };
}

export default useExamSessionSocket;
