import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Zap, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StreakTrackerProps {
  className?: string;
}

export default function StreakTracker({ className }: StreakTrackerProps) {
  const [fireAnimation, setFireAnimation] = useState(false);
  const [prevStreak, setPrevStreak] = useState(0);

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    refetchInterval: 10000,
  });

  // Trigger fire animation when streak increases
  useEffect(() => {
    if (userStats && userStats.currentStreak > prevStreak) {
      setFireAnimation(true);
      setPrevStreak(userStats.currentStreak);
      setTimeout(() => setFireAnimation(false), 2000);
    }
  }, [userStats?.currentStreak, prevStreak]);

  if (!userStats) return null;

  const isStreakActive = userStats.currentStreak > 0;
  const streakMultiplier = Math.floor(userStats.currentStreak / 7) + 1; // Bonus every 7 days

  return (
    <div className={className}>
      <Card className="glass-morphism neon-border bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10"></div>
        <CardContent className="p-6 relative z-10">
          
          {/* Fire Animation */}
          {fireAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl animate-bounce">
                🔥
              </div>
            </div>
          )}

          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm font-mono mb-2">DAILY STREAK</div>
            <div className="flex items-center justify-center mb-2">
              <Flame className={`w-8 h-8 mr-2 ${
                isStreakActive ? 'text-orange-400 animate-pulse' : 'text-gray-600'
              }`} />
              <div className={`text-6xl font-bold font-mono neon-text ${
                isStreakActive ? 'text-orange-400' : 'text-gray-600'
              }`}>
                {userStats.currentStreak}
              </div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {isStreakActive ? 'DAYS ON FIRE!' : 'START YOUR STREAK!'}
            </div>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-xs font-mono text-yellow-400">BEST</span>
              </div>
              <div className="text-xl font-bold font-mono text-yellow-400">
                {userStats.longestStreak}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-xs font-mono text-purple-400">BONUS</span>
              </div>
              <div className="text-xl font-bold font-mono text-purple-400">
                {streakMultiplier}x
              </div>
            </div>
          </div>

          {/* Streak Milestones */}
          <div className="space-y-2">
            <div className="text-xs text-cyan-400 font-mono">STREAK MILESTONES</div>
            <div className="space-y-1">
              {[
                { days: 3, reward: 'Focus Novice', unlocked: userStats.currentStreak >= 3 },
                { days: 7, reward: 'Week Warrior', unlocked: userStats.currentStreak >= 7 },
                { days: 14, reward: 'Fortnight Master', unlocked: userStats.currentStreak >= 14 },
                { days: 30, reward: 'Month Legend', unlocked: userStats.currentStreak >= 30 },
              ].map((milestone, index) => (
                <div key={index} className={`flex justify-between items-center text-xs p-2 rounded ${
                  milestone.unlocked ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/20 text-gray-500'
                }`}>
                  <span className="font-mono">{milestone.days} days</span>
                  <span className="font-mono">{milestone.reward}</span>
                  {milestone.unlocked && <span className="text-green-400">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Warning for broken streak */}
          {userStats.currentStreak === 0 && userStats.longestStreak > 0 && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
              <div className="text-xs text-red-400 font-mono text-center">
                STREAK BROKEN! Get back on track today 🔥
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}