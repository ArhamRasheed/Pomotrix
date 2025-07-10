import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Award, Star } from "lucide-react";

interface StatisticsPanelProps {
  todayStats?: any;
  recentSessions?: any[];
}

export default function StatisticsPanel({ todayStats, recentSessions }: StatisticsPanelProps) {
  const achievements = [
    { icon: Target, name: "FOCUS MASTER", color: "text-green-400", threshold: 1 },
    { icon: Zap, name: "STREAK LEGEND", color: "text-yellow-400", threshold: 5 },
    { icon: Award, name: "SPEED DEMON", color: "text-blue-400", threshold: 10 },
    { icon: Star, name: "STAR PERFORMER", color: "text-purple-400", threshold: 25 },
  ];

  const formatSessionTime = (completedAt: string) => {
    const date = new Date(completedAt);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Session Counter */}
      <Card className="glass-morphism neon-border bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-cyan-400/10"></div>
        <CardContent className="p-6 relative z-10">
          <div className="text-center">
            <div className="text-cyan-400 text-xs mb-3 font-mono tracking-widest">TODAY'S SESSIONS</div>
            <div className="text-6xl font-bold font-mono neon-text pulse-glow mb-2">
              {String(todayStats?.focusSessions || 0).padStart(2, '0')}
            </div>
            <div className="text-cyan-400 text-xs font-mono tracking-wide opacity-80">FOCUS BLOCKS COMPLETED</div>
            <div className="mt-3 text-xs text-gray-500 font-mono">
              {Math.round(((todayStats?.totalFocusTime || 0) / 60))} minutes focused
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">WEEKLY PROGRESS</div>
          </div>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
              const today = new Date();
              const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday=0 to Sunday=6
              const isToday = index === dayIndex;
              const sessionsCount = isToday ? (todayStats?.focusSessions || 0) : 0;
              const progressValue = Math.min(100, (sessionsCount / 10) * 100); // 10 sessions = 100%
              
              return (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm font-mono text-cyan-400">{day}</span>
                  <div className="flex-1 mx-3 bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                  <span className="text-sm text-green-400 font-mono">
                    {sessionsCount}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress Bar */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">TOTAL FOCUS TIME</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-400 font-mono">0h</span>
              <span className="text-cyan-400 font-mono">Target: 100h</span>
            </div>
            <div className="bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${Math.min(100, ((todayStats?.totalFocusTime || 0) / 3600) / 100 * 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-green-400 neon-text">
                {Math.round(((todayStats?.totalFocusTime || 0) / 3600) * 10) / 10}h
              </div>
              <div className="text-xs text-cyan-400 font-mono">TOTAL FOCUSED</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">ACHIEVEMENTS</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const totalHours = (todayStats?.totalFocusTime || 0) / 3600;
              const isUnlocked = totalHours >= achievement.threshold;
              
              return (
                <div key={index} className={`text-center p-3 rounded-lg border transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-gray-900/50 border-green-400/60 hover:border-green-400/80 hover:bg-gray-800/50' 
                    : 'bg-gray-900/20 border-gray-700/30 opacity-50'
                }`}>
                  <achievement.icon className={`w-8 h-8 mx-auto mb-2 drop-shadow-lg ${
                    isUnlocked ? achievement.color : 'text-gray-600'
                  }`} 
                    style={{ filter: isUnlocked ? `drop-shadow(0 0 8px ${achievement.color.includes('green') ? '#00ff41' : achievement.color.includes('yellow') ? '#fbbf24' : achievement.color.includes('blue') ? '#00d4ff' : '#a855f7'})` : 'none' }} />
                  <div className={`text-xs font-mono tracking-wide ${
                    isUnlocked ? 'text-green-400' : 'text-gray-600'
                  }`}>{achievement.name}</div>
                  <div className="text-xs text-cyan-400 font-mono opacity-60 mt-1">
                    {achievement.threshold}h
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
