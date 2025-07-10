import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Trophy, Target, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LevelingSystemProps {
  className?: string;
}

export default function LevelingSystem({ className }: LevelingSystemProps) {
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    refetchInterval: 10000,
  });

  // Calculate XP progress within current level
  const currentLevelXP = userStats ? (userStats.level - 1) * 100 : 0;
  const nextLevelXP = userStats ? userStats.level * 100 : 100;
  const progressXP = userStats ? userStats.totalXP - currentLevelXP : 0;
  const progressPercentage = (progressXP / 100) * 100;

  // Check for level up
  useEffect(() => {
    if (userStats && userStats.level > prevLevel) {
      setLevelUpAnimation(true);
      setPrevLevel(userStats.level);
      setTimeout(() => setLevelUpAnimation(false), 3000);
    }
  }, [userStats?.level, prevLevel]);

  if (!userStats) return null;

  return (
    <div className={className}>
      <Card className="glass-morphism neon-border bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10"></div>
        <CardContent className="p-6 relative z-10">
          {/* Level Up Animation */}
          {levelUpAnimation && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 animate-pulse">
              <div className="text-center">
                <div className="text-4xl font-bold font-mono text-yellow-400 neon-text mb-2">
                  LEVEL UP!
                </div>
                <div className="text-xl font-mono text-cyan-400">
                  Level {userStats.level}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="text-cyan-400 text-sm font-mono mb-2">FOCUS LEVEL</div>
            <div className="text-6xl font-bold font-mono text-purple-400 neon-text mb-2">
              {userStats.level}
            </div>
            <Badge className="bg-purple-900/50 text-purple-400 border-purple-400/50">
              <Zap className="w-3 h-3 mr-1" />
              {userStats.totalXP} XP
            </Badge>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-green-400 font-mono">Level {userStats.level}</span>
              <span className="text-cyan-400 font-mono">Level {userStats.level + 1}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-gray-800"
            />
            <div className="text-center text-xs text-gray-400 font-mono">
              {progressXP}/100 XP to next level
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-orange-400 mr-1" />
                <span className="text-sm font-mono text-orange-400">STREAK</span>
              </div>
              <div className="text-2xl font-bold font-mono text-orange-400 neon-text">
                {userStats.currentStreak}
              </div>
              <div className="text-xs text-gray-400">days</div>
            </div>

            <div className="text-center p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-sm font-mono text-yellow-400">BEST</span>
              </div>
              <div className="text-2xl font-bold font-mono text-yellow-400 neon-text">
                {userStats.longestStreak}
              </div>
              <div className="text-xs text-gray-400">days</div>
            </div>
          </div>

          {/* XP Rewards Info */}
          <div className="mt-4 p-3 bg-gray-900/20 rounded-lg">
            <div className="text-xs text-cyan-400 font-mono mb-2">XP REWARDS</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-green-400">Focus Session</span>
                <span className="text-white">+20 XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">Break Session</span>
                <span className="text-white">+5 XP</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}