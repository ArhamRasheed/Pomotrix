import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DigitalRain from "@/components/DigitalRain";
import TimerCircle from "@/components/TimerCircle";
import StatisticsPanel from "@/components/StatisticsPanel";
import { usePomodoro } from "@/hooks/usePomodoro";
import { quotes } from "@/data/quotes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function PomodoroPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const { 
    timeLeft, 
    isRunning, 
    isBreak, 
    progress, 
    start, 
    pause, 
    reset 
  } = usePomodoro();

  const today = new Date().toISOString().split('T')[0];
  
  const { data: todayStats } = useQuery({
    queryKey: ['/api/stats/daily', today],
    refetchInterval: 30000,
  });

  const { data: recentSessions } = useQuery({
    queryKey: ['/api/sessions/recent', 10],
    refetchInterval: 30000,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="min-h-screen matrix-bg overflow-hidden font-mono">
      <DigitalRain />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Timer Section */}
          <div className="lg:col-span-2 glass-morphism rounded-xl p-8 neon-border">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold neon-text neon-flicker mb-2">
                MATRIX POMODORO
              </h1>
              <p className="text-cyan-400 text-lg">Focus. Execute. Transcend.</p>
            </div>
            
            {/* Timer Display */}
            <div className="flex justify-center mb-8">
              <TimerCircle 
                timeLeft={timeLeft}
                isBreak={isBreak}
                progress={progress}
              />
            </div>
            
            {/* Timer Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                onClick={start}
                disabled={isRunning}
                className="cyber-button px-8 py-3 text-lg font-semibold"
              >
                START
              </Button>
              <Button 
                onClick={pause}
                disabled={!isRunning}
                className="cyber-button px-8 py-3 text-lg font-semibold"
              >
                PAUSE
              </Button>
              <Button 
                onClick={reset}
                className="cyber-button px-8 py-3 text-lg font-semibold"
              >
                RESET
              </Button>
            </div>
            
            {/* Session Quote */}
            <Card className="glass-morphism neon-border bg-transparent">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-cyan-400 text-sm mb-2">SESSION QUOTE</div>
                  <p className="text-lg italic text-white mb-2">
                    "{currentQuote.text}"
                  </p>
                  <div className="text-cyan-400 text-sm">- {currentQuote.author}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Statistics Panel */}
          <StatisticsPanel 
            todayStats={todayStats}
            recentSessions={recentSessions}
          />
          
        </div>
      </div>
      
      {/* Floating Settings Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button 
          className="cyber-button w-14 h-14 rounded-full pulse-glow"
          size="icon"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
