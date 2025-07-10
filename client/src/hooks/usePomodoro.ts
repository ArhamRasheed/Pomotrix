import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAudio } from "./useAudio";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const FOCUS_TIME = 20 * 60; // 20 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

export function usePomodoro() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [completedSession, setCompletedSession] = useState<{type: 'focus' | 'break', duration: number} | null>(null);
  
  const { playAlarm } = useAudio();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/sessions", sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats/daily'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions/recent'] });
    },
  });

  const saveSession = useCallback(async (type: 'focus' | 'break', duration: number, name?: string) => {
    const now = new Date();
    const sessionData = {
      type,
      name: name || null,
      duration,
      completedAt: now.toISOString(),
      date: now.toISOString().split('T')[0],
    };
    
    await createSessionMutation.mutateAsync(sessionData);
  }, [createSessionMutation]);

  const switchMode = useCallback(async () => {
    const completedDuration = isBreak ? BREAK_TIME - timeLeft : FOCUS_TIME - timeLeft;
    const sessionType = isBreak ? 'break' : 'focus';
    
    if (completedDuration > 0) {
      // Only show name dialog for focus sessions
      if (sessionType === 'focus') {
        setCompletedSession({ type: sessionType, duration: completedDuration });
        setShowNameDialog(true);
      } else {
        await saveSession(sessionType, completedDuration);
      }
    }

    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? FOCUS_TIME : BREAK_TIME);
    setIsRunning(false);
    setSessionStartTime(null);
    
    // Play alarm sound
    playAlarm();
    
    // Show notification
    toast({
      title: isBreak ? "Break Complete!" : "Focus Session Complete!",
      description: isBreak ? "Time to focus again!" : "Time for a break!",
    });
  }, [isBreak, timeLeft, playAlarm, toast, saveSession]);

  const handleSessionNamed = useCallback(async (name: string) => {
    if (completedSession) {
      await saveSession(completedSession.type, completedSession.duration, name);
      setCompletedSession(null);
    }
    setShowNameDialog(false);
  }, [completedSession, saveSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, switchMode]);

  const start = useCallback(() => {
    setIsRunning(true);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [sessionStartTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME);
    setSessionStartTime(null);
  }, [isBreak]);

  const progress = isBreak 
    ? (BREAK_TIME - timeLeft) / BREAK_TIME
    : (FOCUS_TIME - timeLeft) / FOCUS_TIME;

  return {
    timeLeft,
    isRunning,
    isBreak,
    progress,
    start,
    pause,
    reset,
    showNameDialog,
    setShowNameDialog,
    completedSession,
    handleSessionNamed,
  };
}
