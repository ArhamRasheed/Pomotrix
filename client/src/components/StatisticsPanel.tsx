import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Award, Star } from "lucide-react";

interface StatisticsPanelProps {
  todayStats?: any;
  recentSessions?: any[];
}

export default function StatisticsPanel({ todayStats, recentSessions }: StatisticsPanelProps) {
  const achievements = [
    { icon: Target, name: "FOCUS MASTER", color: "text-green-400" },
    { icon: Zap, name: "STREAK LEGEND", color: "text-yellow-400" },
    { icon: Award, name: "SPEED DEMON", color: "text-blue-400" },
    { icon: Star, name: "STAR PERFORMER", color: "text-purple-400" },
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
              // Start from 0 for all days since no previous data
              const progressValue = 0;
              const sessionsCount = 0;
              return (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm font-mono">{day}</span>
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

      {/* Achievement Badges */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">ACHIEVEMENTS</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-3 bg-gray-900/50 rounded-lg border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:bg-gray-800/50">
                <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color} drop-shadow-lg`} 
                  style={{ filter: `drop-shadow(0 0 8px ${achievement.color.includes('green') ? '#00ff41' : achievement.color.includes('yellow') ? '#fbbf24' : achievement.color.includes('blue') ? '#00d4ff' : '#a855f7'})` }} />
                <div className="text-xs text-green-400 font-mono tracking-wide">{achievement.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
